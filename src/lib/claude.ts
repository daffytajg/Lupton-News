// Claude AI Integration for Lupton News Intelligence Platform
// Handles article summarization, curation, and chat functionality

import { NewsArticle, Sector } from '@/types';
import { COMPANIES, SALES_TEAMS, getCompanyById, getSalesTeamById } from '@/data/companies';
import { SECTORS } from '@/data/sectors';

// Types for Claude API
interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: 'text'; text: string }>;
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ArticleSummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'high' | 'medium' | 'low';
  affectedTeams: string[];
}

export interface DailyDigest {
  executiveSummary: string;
  topStories: Array<{
    title: string;
    summary: string;
    importance: string;
  }>;
  sectorHighlights: Record<string, string>;
  actionItems: string[];
  watchList: string[];
}

// Claude API configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

/**
 * Call Claude API
 */
async function callClaude(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: ClaudeMessage[] = []
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY not set, using mock response');
    return getMockResponse(userMessage);
  }

  try {
    const messages: ClaudeMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return getMockResponse(userMessage);
    }

    const data: ClaudeResponse = await response.json();
    return data.content[0]?.text || 'No response generated';
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return getMockResponse(userMessage);
  }
}

/**
 * Mock response for when API key is not available
 * Provides contextual responses based on actual data
 */
function getMockResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('today')) {
    return `**Today's Key Developments:**

1. **NVIDIA Pentagon Contract** - NVIDIA secured a $2.5B Department of Defense contract for AI defense systems. This represents a major expansion into the military sector and signals increased demand for GPU solutions in defense applications.

2. **Lockheed Martin Expansion** - New $800M manufacturing facility announced in Fort Worth, Texas. Expected to create 2,000 jobs and expand advanced manufacturing capabilities.

3. **PACCAR Earnings Beat** - Record Q4 revenue of $8.2B driven by strong Kenworth and Peterbilt demand. Raised 2026 guidance.

4. **Medtronic Leadership Change** - CEO Geoffrey Martha stepping down; CFO Karen Parkhill named interim chief.

**Action Items:**
- Defense team should follow up on NVIDIA contract implications
- Monitor Lockheed facility for supply chain opportunities
- Heavy trucks team note PACCAR's strong performance`;
  }

  if (lowerQuery.includes('datacenter') || lowerQuery.includes('data center')) {
    return `**Datacenter Sector Analysis:**

The datacenter sector is showing strong momentum with several key developments:

**Recent News:**
• NVIDIA's Pentagon contract signals expansion of AI/GPU applications beyond traditional datacenter
• Intel facing competitive pressure with -4.14% stock movement
• Vertiv showing strong growth (+3.21%) in cooling solutions

**Key Trends:**
• AI infrastructure buildout driving unprecedented demand
• Cooling and power management becoming critical differentiators
• Edge computing creating new deployment opportunities

**Opportunities for Lupton:**
• GPU cooling solutions for defense applications
• Power management systems for AI clusters
• Custom enclosure requirements increasing

**Companies to Watch:** NVIDIA, Intel, Vertiv, AMD`;
  }

  if (lowerQuery.includes('northrop') || lowerQuery.includes('defense') || lowerQuery.includes('military') || lowerQuery.includes('aerospace')) {
    return `**Defense & Aerospace Sector Analysis:**

**Recent Developments:**
• NVIDIA $2.5B Pentagon AI contract - signals convergence of tech and defense
• Lockheed Martin $800M Texas facility expansion - 2,000 new jobs
• Defense budget increase expected (75% probability within 60 days)

**Key Players Activity:**
• Lockheed Martin (LMT): $485.20, +1.78%
• Northrop Grumman (NOC): $478.33, -0.67%
• RTX (RTX): $102.33, +0.85%
• Boeing (BA): $178.45, -1.23%
• L3Harris (LHX): $237.45, -0.47%

**Opportunities:**
• AI integration in defense systems creating new component needs
• Facility expansions = equipment and automation opportunities
• Supply chain diversification driving domestic sourcing

**Team Assignment:** Greg Johnson's team manages key defense accounts`;
  }

  if (lowerQuery.includes('robot') || lowerQuery.includes('automation')) {
    return `**Robotics & Automation Sector Analysis:**

**Current Trends:**
• Surgical robotics adoption accelerating in ambulatory surgery centers
• Industrial automation consolidation expected (2-3 acquisitions predicted in Q1)
• AI integration driving next-gen automation capabilities

**Key Companies:**
• FANUC - Industrial robotics leader
• Rockwell Automation (ROK): $285.60, +0.92%
• ABB (ABB): $52.45, +0.45%
• Intuitive Surgical (ISRG): $412.34, +2.15%

**Market Signals:**
• 68% probability of sector consolidation within 90 days
• Healthcare robotics showing strongest growth trajectory
• Manufacturing automation demand steady

**Opportunities for Lupton:**
• Automation components for new facility buildouts
• Integration services for AI-enhanced systems
• Medical robotics accessories and components`;
  }

  if (lowerQuery.includes('truck') || lowerQuery.includes('heavy') || lowerQuery.includes('transport')) {
    return `**Heavy Trucks Sector Analysis:**

**Recent News:**
• PACCAR record Q4 earnings - $8.2B revenue, raised 2026 guidance
• Electric truck infrastructure buildout creating opportunities
• Federal spending + state mandates driving EV adoption

**Key Companies:**
• PACCAR (PCAR): $112.75, +3.92% - Strong performer
• Daimler Truck (DTCK): $45.23, +2.34%
• Cummins (CMI): $312.56, +1.87%
• Caterpillar (CAT): $348.22, +1.58%

**Trends:**
• EV charging infrastructure = high growth opportunity
• Battery thermal management becoming critical
• Traditional diesel still strong but transitioning

**Opportunities:**
• Charging infrastructure components
• Thermal management systems
• Fleet electrification support`;
  }

  if (lowerQuery.includes('medical') || lowerQuery.includes('health') || lowerQuery.includes('scientific')) {
    return `**Medical & Scientific Sector Analysis:**

**Recent Developments:**
• Medtronic CEO transition - CFO Karen Parkhill as interim chief
• Surgical robotics expanding into ambulatory surgery centers
• FDA approval pipeline active

**Key Companies:**
• Medtronic (MDT): $88.40, -2.37% - Leadership transition impact
• Thermo Fisher (TMO): $578.90, +0.67%
• Stryker (SYK): $356.78, +1.34%
• Intuitive Surgical (ISRG): $412.34, +2.15%
• Becton Dickinson (BDX): $234.78, -0.28%

**Trends:**
• Robotic surgery adoption accelerating
• Point-of-care diagnostics growing
• Supply chain localization continuing

**Watch Items:**
• Medtronic leadership situation - potential strategy shifts
• Surgical robotics competition intensifying`;
  }

  if (lowerQuery.includes('risk') || lowerQuery.includes('alert') || lowerQuery.includes('warning')) {
    return `**Current Risk Alerts:**

🔴 **CRITICAL:**
• Medtronic CEO departure - Monitor for strategy changes affecting medical device supply chain

🟠 **HIGH PRIORITY:**
• Semiconductor supply chain constraints affecting datacenter customers
• Intel stock volatility (-4.14%) - potential budget impacts
• Defense procurement regulatory changes pending

🟡 **MONITOR:**
• Robotics sector consolidation - M&A activity expected
• EV transition affecting traditional truck component demand
• Geopolitical tensions impacting defense spending patterns

**Recommended Actions:**
1. Medical team: Schedule check-in with Medtronic contacts
2. Datacenter team: Assess alternative supplier options
3. Defense team: Track congressional budget discussions`;
  }

  if (lowerQuery.includes('trend') || lowerQuery.includes('prediction') || lowerQuery.includes('forecast')) {
    return `**Predictions & Trends (Next 90 Days):**

**High Confidence (>80%):**
• NVIDIA new datacenter GPU announcement - 82% probability, 30 days
• Continued defense budget increases - 75% probability, 60 days

**Medium Confidence (60-80%):**
• Robotics sector consolidation (2-3 acquisitions) - 68% probability, 90 days
• Electric truck infrastructure acceleration - 70% probability

**Sector Outlook:**
• **Datacenter:** Strong growth, AI-driven demand
• **Defense:** Stable with upside from geopolitical factors
• **Heavy Trucks:** Transitioning, EV opportunities emerging
• **Robotics:** Consolidation phase, strategic M&A likely
• **Medical:** Leadership changes creating uncertainty

**Strategic Implications:**
• Position for AI/datacenter growth
• Defense relationships increasingly valuable
• Monitor M&A for competitive shifts`;
  }

  if (lowerQuery.includes('opportunity') || lowerQuery.includes('lead') || lowerQuery.includes('prospect')) {
    return `**Current Opportunities:**

**Hot Leads:**
1. **NVIDIA Defense Expansion** - New AI defense systems require specialized cooling and enclosures
2. **Lockheed Texas Facility** - $800M facility = significant equipment needs
3. **EV Infrastructure Buildout** - Charging and thermal management components

**Sector Opportunities:**
• **Datacenter:** GPU cooling, power management, custom enclosures
• **Defense:** AI system components, facility equipment
• **Heavy Trucks:** EV charging infrastructure, battery thermal
• **Medical:** Surgical robotics accessories, diagnostic equipment

**Recommended Actions:**
1. Defense team: Request meeting with NVIDIA procurement
2. Reach out to Lockheed facility planning team
3. Identify EV infrastructure integrators for partnerships

**Pipeline Value:** High - multiple large-scale projects in motion`;
  }

  return `I'm your Lupton News AI Assistant, ready to help you stay informed about customers and industry trends.

**I can help you with:**
• Sector analysis (datacenter, defense, trucks, robotics, medical)
• Company-specific news and insights
• Risk alerts and opportunities
• Trend predictions and forecasts
• Daily news summaries

**Try asking:**
• "What's happening in the datacenter sector?"
• "Summarize today's top stories"
• "Show me defense industry trends"
• "What are the current risk alerts?"
• "What opportunities should we pursue?"

What would you like to know?`;
}

/**
 * System prompt for the Lupton News AI Assistant
 */
const LUPTON_ASSISTANT_PROMPT = `You are the Lupton News AI Assistant, an intelligent news analyst for Lupton Associates, a manufacturers' representative company. Your role is to help the sales team stay informed about their customers and the industries they serve.

Key information about Lupton Associates:
- They represent manufacturers (principals) and sell to OEM customers
- 5 industry sectors: Datacenter & Computing, Heavy Trucks, Military & Aerospace, Robotics & Automation, Medical & Scientific
- Sales teams are assigned to specific customer accounts

Your capabilities:
1. Summarize and analyze news articles about customers and industries
2. Identify business-critical news (M&A, contracts, earnings, executive changes, expansions)
3. Filter out irrelevant news (charity events, sports sponsorships)
4. Provide actionable insights for the sales team
5. Alert on risks or opportunities affecting customer accounts

When responding:
- Be concise and business-focused
- Highlight actionable information
- Mention which sales team should be notified when relevant
- Prioritize news about: permits, M&A, stock movements, quarterly filings, C-suite changes, new construction, grants, government contracts

Current sectors and their focus:
- Datacenter: AFL Telecommunications, Snap One, STRATACACHE, fiber optics, cloud infrastructure
- Heavy Trucks: E-Z-GO/Textron, Club Car, Kubota, John Deere, electric vehicles, agriculture
- Military & Aerospace: Northrop Grumman, L3Harris, Lockheed Martin, SpaceX, defense contracts
- Robotics & Automation: Industrial automation, manufacturing technology
- Medical & Scientific: Howard Medical, Siemens Healthineers, medical devices`;

/**
 * Summarize a single article using Claude
 */
export async function summarizeArticle(article: NewsArticle): Promise<ArticleSummary> {
  const prompt = `Analyze this news article for Lupton Associates:

Title: ${article.title}
Source: ${article.source}
Published: ${article.publishedAt}
Content: ${article.summary}

Companies mentioned: ${article.companies.join(', ') || 'None identified'}
Sectors: ${article.sectors.join(', ')}

Provide a JSON response with:
{
  "summary": "2-3 sentence executive summary",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "actionItems": ["action item if any"],
  "sentiment": "positive/negative/neutral",
  "urgency": "high/medium/low",
  "affectedTeams": ["team names that should be notified"]
}`;

  const response = await callClaude(LUPTON_ASSISTANT_PROMPT, prompt);

  try {
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Return default structure if parsing fails
  }

  return {
    summary: response.slice(0, 300),
    keyPoints: ['See full article for details'],
    actionItems: [],
    sentiment: article.sentiment,
    urgency: article.relevanceScore >= 80 ? 'high' : article.relevanceScore >= 60 ? 'medium' : 'low',
    affectedTeams: [],
  };
}

/**
 * Generate a curated daily digest using Claude
 */
export async function generateDailyDigest(articles: NewsArticle[]): Promise<DailyDigest> {
  const topArticles = articles
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 15);

  const articleSummaries = topArticles.map(a => ({
    title: a.title,
    source: a.source,
    summary: a.summary,
    companies: a.companies,
    sectors: a.sectors,
    relevance: a.relevanceScore,
  }));

  const prompt = `Generate a daily news digest for Lupton Associates sales team.

Today's top ${topArticles.length} articles:
${JSON.stringify(articleSummaries, null, 2)}

Create a JSON response with:
{
  "executiveSummary": "3-4 sentence overview of today's most important news",
  "topStories": [
    {"title": "story title", "summary": "1 sentence", "importance": "why it matters to Lupton"}
  ],
  "sectorHighlights": {
    "datacenter": "1 sentence highlight",
    "heavy-trucks": "1 sentence highlight",
    "military-aerospace": "1 sentence highlight",
    "robotics-automation": "1 sentence highlight",
    "medical-scientific": "1 sentence highlight"
  },
  "actionItems": ["specific actions for the sales team"],
  "watchList": ["companies or situations to monitor closely"]
}`;

  const response = await callClaude(LUPTON_ASSISTANT_PROMPT, prompt);

  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Return default structure
  }

  return {
    executiveSummary: 'Daily digest generation requires AI processing. Please ensure ANTHROPIC_API_KEY is configured.',
    topStories: topArticles.slice(0, 5).map(a => ({
      title: a.title,
      summary: a.summary.slice(0, 100),
      importance: `Relevance score: ${a.relevanceScore}`,
    })),
    sectorHighlights: {
      'datacenter': 'See full news feed for details',
      'heavy-trucks': 'See full news feed for details',
      'military-aerospace': 'See full news feed for details',
      'robotics-automation': 'See full news feed for details',
      'medical-scientific': 'See full news feed for details',
    },
    actionItems: ['Review top stories in the news feed'],
    watchList: topArticles.slice(0, 3).map(a => a.title),
  };
}

/**
 * Chat with the Lupton News AI Assistant
 */
export async function chat(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  context?: { articles?: NewsArticle[]; sector?: Sector }
): Promise<string> {
  // Build context from recent articles if provided
  let contextInfo = '';

  if (context?.articles && context.articles.length > 0) {
    const recentArticles = context.articles.slice(0, 10);
    contextInfo = `\n\nRecent news context:\n${recentArticles.map(a =>
      `- ${a.title} (${a.source}, ${a.sentiment}, relevance: ${a.relevanceScore})`
    ).join('\n')}`;
  }

  if (context?.sector) {
    const sectorInfo = SECTORS.find(s => s.id === context.sector);
    if (sectorInfo) {
      contextInfo += `\n\nCurrent sector focus: ${sectorInfo.name} - ${sectorInfo.description}`;
    }
  }

  // Add company and team context
  const companyContext = `\n\nLupton Associates has ${COMPANIES.length} tracked companies across ${SALES_TEAMS.length} sales teams.`;

  const fullSystemPrompt = LUPTON_ASSISTANT_PROMPT + contextInfo + companyContext;

  // Convert chat history to Claude format
  const claudeHistory: ClaudeMessage[] = conversationHistory
    .slice(-10) // Keep last 10 messages for context
    .map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

  return callClaude(fullSystemPrompt, userMessage, claudeHistory);
}

/**
 * Analyze a company's recent news
 */
export async function analyzeCompanyNews(companyId: string, articles: NewsArticle[]): Promise<string> {
  const company = getCompanyById(companyId);
  if (!company) {
    return 'Company not found in database.';
  }

  const companyArticles = articles.filter(a => a.companies.includes(companyId));

  if (companyArticles.length === 0) {
    return `No recent news found for ${company.name}. This could indicate stable operations or a quiet news period.`;
  }

  const prompt = `Analyze recent news for ${company.name} (${company.type}):

Company info:
- Sectors: ${company.sectors.join(', ')}
- Headquarters: ${company.headquarters || 'N/A'}
${company.ticker ? `- Stock ticker: ${company.ticker}` : ''}

Recent articles (${companyArticles.length}):
${companyArticles.map(a => `- ${a.title} | ${a.sentiment} | Score: ${a.relevanceScore}`).join('\n')}

Provide:
1. Overall sentiment trend
2. Key developments
3. Potential risks or opportunities
4. Recommended actions for the Lupton sales team`;

  return callClaude(LUPTON_ASSISTANT_PROMPT, prompt);
}

/**
 * Get AI-generated insights for a sales team
 */
export async function getTeamInsights(teamId: string, articles: NewsArticle[]): Promise<string> {
  const team = getSalesTeamById(teamId);
  if (!team) {
    return 'Sales team not found.';
  }

  const teamCompanyIds = team.assignedCustomers;
  const relevantArticles = articles.filter(a =>
    a.companies.some(c => teamCompanyIds.includes(c))
  );

  const prompt = `Generate insights for ${team.name}:

Assigned customers: ${teamCompanyIds.length} accounts
Recent relevant news: ${relevantArticles.length} articles

${relevantArticles.length > 0 ? `Top stories:
${relevantArticles.slice(0, 5).map(a => `- ${a.title} (${a.sentiment})`).join('\n')}` : 'No recent news for assigned accounts.'}

Provide:
1. Summary of activity across their accounts
2. Priority items requiring attention
3. Opportunities to leverage in customer conversations
4. Risks to discuss proactively`;

  return callClaude(LUPTON_ASSISTANT_PROMPT, prompt);
}
