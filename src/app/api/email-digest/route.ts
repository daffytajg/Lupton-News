import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/googleNews';
import { generateDailyDigest } from '@/lib/claude';
import { sendDailyDigest, sendTeamDigests } from '@/lib/email';
import { COMPANIES, SALES_TEAMS } from '@/data/companies';
import { SECTORS } from '@/data/sectors';

// API route for generating and sending daily email digests
// Uses Claude AI for summarization and Resend for delivery

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'user-1';
  const preview = searchParams.get('preview') === 'true';

  try {
    // Fetch current news articles
    const articles = await fetchAllNews();

    // Generate AI-curated digest
    const digest = await generateDailyDigest(articles);

    // Get stats
    const stats = {
      totalArticles: articles.length,
      breakingNews: articles.filter(a => a.isBreaking).length,
      positiveSentiment: articles.filter(a => a.sentiment === 'positive').length,
      negativeSentiment: articles.filter(a => a.sentiment === 'negative').length,
      highPriority: articles.filter(a => a.relevanceScore >= 80).length,
      sectorCounts: SECTORS.reduce((acc, sector) => {
        acc[sector.id] = articles.filter(a => a.sectors.includes(sector.id as any)).length;
        return acc;
      }, {} as Record<string, number>),
    };

    if (preview) {
      return NextResponse.json({
        success: true,
        preview: true,
        digest,
        stats,
        generatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email digest generated successfully',
      digest,
      stats,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email digest error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate email digest' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, recipients, teamId, userId } = body;

    // Fetch current news articles
    const articles = await fetchAllNews();

    // Generate AI-curated digest
    const digest = await generateDailyDigest(articles);

    switch (action) {
      case 'sendToRecipient': {
        // Send to a single recipient
        if (!recipients || !recipients.email) {
          return NextResponse.json(
            { success: false, error: 'Recipient email is required' },
            { status: 400 }
          );
        }

        const result = await sendDailyDigest(
          recipients.email,
          recipients.name || 'Team Member',
          digest,
          articles,
          teamId
        );

        return NextResponse.json({
          success: result.success,
          message: result.success ? 'Email sent successfully' : 'Failed to send email',
          messageId: result.messageId,
          error: result.error,
          sentAt: new Date().toISOString(),
        });
      }

      case 'sendToTeam': {
        // Send to all members of a sales team
        if (!teamId) {
          return NextResponse.json(
            { success: false, error: 'Team ID is required' },
            { status: 400 }
          );
        }

        const team = SALES_TEAMS.find(t => t.id === teamId);
        if (!team) {
          return NextResponse.json(
            { success: false, error: 'Team not found' },
            { status: 404 }
          );
        }

        // In production, you would fetch team member emails from a database
        // For now, return a mock response
        return NextResponse.json({
          success: true,
          message: `Digest would be sent to ${team.name}`,
          team: team.name,
          customersIncluded: team.assignedCustomers.length,
          generatedAt: new Date().toISOString(),
        });
      }

      case 'sendToAll': {
        // Send to all configured recipients
        // This would typically be called by a cron job

        // Mock team email mapping (in production, fetch from database)
        const teamEmails: Record<string, { email: string; name: string }> = {
          'team-john-walker': { email: 'jwalker@luptons.com', name: 'John Walker' },
          'team-jennings-harley': { email: 'jharley@luptons.com', name: 'Jennings Harley' },
          'team-mike-laney': { email: 'mlaney@luptons.com', name: 'Mike Laney' },
          'team-chris-dunham': { email: 'cdunham@luptons.com', name: 'Chris Dunham' },
          'team-greg-johnson': { email: 'gjohnson@luptons.com', name: 'Greg Johnson' },
          'team-greg-hebert': { email: 'ghebert@luptons.com', name: 'Greg Hebert' },
          'team-cass-roberts': { email: 'croberts@luptons.com', name: 'Cass Roberts' },
          'team-cj-roberts': { email: 'cjroberts@luptons.com', name: 'CJ Roberts' },
          'team-tom-osso': { email: 'tosso@luptons.com', name: 'Tom Osso' },
          'team-luke-hinkle': { email: 'lhinkle@luptons.com', name: 'Luke Hinkle' },
          'team-bobby-ramirez': { email: 'bramirez@luptons.com', name: 'Bobby Ramirez' },
        };

        const results = await sendTeamDigests(digest, articles, teamEmails);

        return NextResponse.json({
          success: true,
          message: `Sent ${results.sent} emails, ${results.failed} failed`,
          results: results.results,
          sentAt: new Date().toISOString(),
        });
      }

      case 'preview': {
        // Return preview of what would be sent
        return NextResponse.json({
          success: true,
          preview: true,
          digest,
          articleCount: articles.length,
          topStories: digest.topStories,
          generatedAt: new Date().toISOString(),
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: sendToRecipient, sendToTeam, sendToAll, or preview' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Email digest POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process email digest request' },
      { status: 500 }
    );
  }
}
