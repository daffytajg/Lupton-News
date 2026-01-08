import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/googleNews';
import { generateDailyDigest, summarizeArticle } from '@/lib/claude';
import { sendDailyDigest } from '@/lib/email';
import { COMPANIES } from '@/data/companies';
import { NewsArticle } from '@/types';
import {
  getAllUsers,
  getUsersWithEmailEnabled,
  getUserRelevantCompanies,
  filterUnsentArticles,
  recordSentArticles,
  UserPreferences,
} from '@/lib/userPreferences';

// Cron endpoint for sending automated daily digest emails
// This should be called by a cron service (Vercel Cron, GitHub Actions, etc.)
// Schedule: 0 7 * * * (7 AM daily)

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // If no secret is configured, allow in development
  if (!cronSecret) {
    console.warn('CRON_SECRET not set - allowing request in development mode');
    return process.env.NODE_ENV !== 'production';
  }

  return authHeader === `Bearer ${cronSecret}`;
}

// Filter articles relevant to a specific user
function getRelevantArticlesForUser(
  user: UserPreferences,
  allArticles: NewsArticle[]
): NewsArticle[] {
  const relevantCompanies = getUserRelevantCompanies(user.id);
  const followedSectors = user.followedSectors;
  const minScore = user.emailPreferences.minRelevanceScore;

  // For executives, show all high-relevance articles
  if (user.role === 'executive') {
    return allArticles.filter(article =>
      article.relevanceScore >= minScore &&
      (followedSectors.length === 0 || article.sectors.some(s => followedSectors.includes(s)))
    );
  }

  // For sales users, filter by their assigned/tagged companies and sectors
  return allArticles.filter(article => {
    // Must meet minimum relevance score
    if (article.relevanceScore < minScore) return false;

    // Check if article is about one of their companies
    const isAboutTheirCompany = article.companies.some(c => relevantCompanies.includes(c));

    // Check if article is in one of their followed sectors
    const isInFollowedSector = article.sectors.some(s => followedSectors.includes(s));

    // Include if about their company OR in their followed sectors (with higher relevance)
    return isAboutTheirCompany || (isInFollowedSector && article.relevanceScore >= 70);
  });
}

// Generate personalized digest for a user
async function generatePersonalizedDigest(
  user: UserPreferences,
  articles: NewsArticle[]
): Promise<{
  digest: Awaited<ReturnType<typeof generateDailyDigest>>;
  articles: NewsArticle[];
}> {
  // Get articles relevant to this user
  let relevantArticles = getRelevantArticlesForUser(user, articles);

  // Filter out articles already sent in the last 3 days
  relevantArticles = filterUnsentArticles(user.id, relevantArticles, 3);

  // Sort by relevance
  relevantArticles.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Limit to top 20 articles
  relevantArticles = relevantArticles.slice(0, 20);

  // Generate AI digest for these articles
  const digest = await generateDailyDigest(relevantArticles);

  return { digest, articles: relevantArticles };
}

export async function POST(request: NextRequest) {
  // Verify authorization
  if (!verifyCronSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { testMode = false, specificUserId } = body;

    console.log(`[Daily Digest] Starting ${testMode ? 'TEST' : 'PRODUCTION'} run at ${new Date().toISOString()}`);

    // Fetch all current news
    const allArticles = await fetchAllNews();
    console.log(`[Daily Digest] Fetched ${allArticles.length} articles`);

    // Get users who have email enabled
    let users = getUsersWithEmailEnabled();

    // If specific user requested (for testing)
    if (specificUserId) {
      users = users.filter(u => u.id === specificUserId);
    }

    console.log(`[Daily Digest] Processing ${users.length} users`);

    const results: Array<{
      userId: string;
      email: string;
      success: boolean;
      articleCount: number;
      error?: string;
    }> = [];

    // Process each user
    for (const user of users) {
      try {
        console.log(`[Daily Digest] Processing user: ${user.name} (${user.email})`);

        // Generate personalized digest
        const { digest, articles: userArticles } = await generatePersonalizedDigest(user, allArticles);

        if (userArticles.length === 0) {
          console.log(`[Daily Digest] No new articles for ${user.name}`);
          results.push({
            userId: user.id,
            email: user.email,
            success: true,
            articleCount: 0,
          });
          continue;
        }

        // Send email (unless test mode)
        if (!testMode) {
          const emailResult = await sendDailyDigest(
            user.email,
            user.name,
            digest,
            userArticles,
            user.teamId
          );

          if (emailResult.success) {
            // Record sent articles to prevent duplicates tomorrow
            recordSentArticles(user.id, userArticles.map(a => ({ id: a.id, url: a.url })));
          }

          results.push({
            userId: user.id,
            email: user.email,
            success: emailResult.success,
            articleCount: userArticles.length,
            error: emailResult.error,
          });
        } else {
          // Test mode - don't send email or record
          results.push({
            userId: user.id,
            email: user.email,
            success: true,
            articleCount: userArticles.length,
          });
        }

        // Small delay between users to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (userError) {
        console.error(`[Daily Digest] Error processing user ${user.email}:`, userError);
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          articleCount: 0,
          error: String(userError),
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    const totalArticles = results.reduce((sum, r) => sum + r.articleCount, 0);

    console.log(`[Daily Digest] Complete: ${successCount} sent, ${failCount} failed, ${totalArticles} total articles`);

    return NextResponse.json({
      success: true,
      summary: {
        usersProcessed: users.length,
        emailsSent: successCount,
        emailsFailed: failCount,
        totalArticlesIncluded: totalArticles,
        testMode,
      },
      results,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Daily Digest] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process daily digest' },
      { status: 500 }
    );
  }
}

// GET endpoint for checking cron status and testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const preview = searchParams.get('preview') === 'true';
  const userId = searchParams.get('userId');

  try {
    if (preview) {
      // Return preview of what would be sent
      const users = getUsersWithEmailEnabled();
      const allArticles = await fetchAllNews();

      const previews = await Promise.all(
        users.slice(0, 3).map(async user => { // Preview first 3 users only
          const { articles } = await generatePersonalizedDigest(user, allArticles);
          return {
            userId: user.id,
            name: user.name,
            email: user.email,
            articleCount: articles.length,
            topArticles: articles.slice(0, 3).map(a => ({
              title: a.title,
              relevance: a.relevanceScore,
            })),
          };
        })
      );

      return NextResponse.json({
        success: true,
        preview: true,
        totalUsers: users.length,
        totalArticles: allArticles.length,
        userPreviews: previews,
      });
    }

    // Return cron status
    const users = getUsersWithEmailEnabled();
    return NextResponse.json({
      success: true,
      status: 'ready',
      usersWithEmailEnabled: users.length,
      configuration: {
        cronSchedule: '0 7 * * * (7 AM daily)',
        deduplicationWindow: '3 days',
        endpoint: '/api/cron/daily-digest',
        method: 'POST',
        authRequired: !!process.env.CRON_SECRET,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get cron status' },
      { status: 500 }
    );
  }
}
