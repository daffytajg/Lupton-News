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
 */
function getMockResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('summarize') || lowerQuery.includes('summary')) {
    return 'This article discusses significant business developments that may impact Lupton Associates customers. Key points include potential supply chain implications and market positioning changes. Recommend monitoring for follow-up announcements.';
  }

  if (lowerQuery.includes('northrop') || lowerQuery.includes('defense')) {
    return 'Based on recent news, Northrop Grumman has been active in securing defense contracts. This is relevant to Team Greg Johnson who manages this account. Recent activity includes aerospace developments and government contract awards.';
  }

  if (lowerQuery.includes('risk') || lowerQuery.includes('alert')) {
    return 'Current risk factors to monitor: 1) Supply chain disruptions in the semiconductor sector affecting datacenter customers, 2) Pending regulatory changes in defense procurement, 3) Market volatility affecting publicly traded customers. Recommend increased monitoring of these areas.';
  }

  return 'I can help you analyze news about Lupton Associates customers and manufacturers. Try asking about specific companies, sectors, or trends. For example: "What\'s happening with our defense customers?" or "Summarize today\'s top stories."';
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
