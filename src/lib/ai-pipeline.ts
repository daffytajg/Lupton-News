/**
 * Advanced AI News Analysis Pipeline
 * Multi-agent system for intelligent news processing
 */

import Anthropic from '@anthropic-ai/sdk';
import { prisma } from './db';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Types for AI analysis
export interface ArticleAnalysis {
  isRelevant: boolean;
  relevanceScore: number;
  relevanceReason: string;
  categories: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  urgency: number;
  extractedEntities: {
    companies: Array<{ name: string; ticker?: string; confidence: number }>;
    people: Array<{ name: string; role?: string; company?: string }>;
    locations: string[];
    amounts: string[];
  };
  summary: string;
  keyPoints: string[];
}

export interface DeepAnalysis {
  businessImpact: {
    direct: string;
    indirect: string;
    timeframe: string;
  };
  opportunities: Array<{
    description: string;
    actionItem: string;
    priority: 'high' | 'medium' | 'low';
    assignTo: string; // Team or role
  }>;
  risks: Array<{
    description: string;
    mitigation: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  competitiveIntelligence: string;
  recommendedActions: Array<{
    action: string;
    owner: string;
    deadline: string;
  }>;
  relatedTrends: string[];
  leadPotential?: {
    isNewLead: boolean;
    companyName?: string;
    sector?: string;
    rationale?: string;
    suggestedApproach?: string;
  };
}

// Lupton Associates context for AI
const LUPTON_CONTEXT = `
You are an AI analyst for Lupton Associates, a manufacturers' representative company.

ABOUT LUPTON ASSOCIATES:
- Website: www.luptons.com
- Business: Manufacturers' representative serving industrial markets
- Key Industries: Datacenter/AI Infrastructure, Military & Aerospace, Heavy Trucks, Medical & Scientific, Robotics & Automation
- Role: Connect manufacturers (principals) with customers, facilitate sales, provide technical expertise

WHAT MATTERS TO LUPTON:
1. Government contracts and defense spending
2. Mergers & acquisitions affecting customers or manufacturers
3. C-suite changes at key accounts
4. New facility construction or expansions
5. Quarterly earnings and financial health
6. Regulatory changes affecting industries
7. Supply chain disruptions
8. New technology adoption
9. Competitor activities
10. Policy changes (tariffs, regulations, executive orders)

WHAT TO FILTER OUT:
- Consumer product news (unless B2B relevant)
- General stock market commentary
- Celebrity/entertainment news
- Sports news
- Weather (unless disaster affecting operations)
- Generic business advice articles
- News about Lupton Associates itself (we already know)

ANALYSIS GOALS:
- Identify sales opportunities
- Spot risks to existing relationships
- Find new prospect leads
- Track competitive landscape
- Monitor regulatory environment
- Provide actionable intelligence
`;

/**
 * Agent 1: Triage and Categorization
 * Fast initial analysis to determine relevance and extract key info
 */
export async function triageArticle(
  title: string,
  content: string,
  source: string
): Promise<ArticleAnalysis> {
  const prompt = `${LUPTON_CONTEXT}

Analyze this news article for Lupton Associates:

TITLE: ${title}
SOURCE: ${source}
CONTENT: ${content}

Provide analysis in JSON format:
{
  "isRelevant": boolean (true if relevant to Lupton's business),
  "relevanceScore": number (0-100, how important is this),
  "relevanceReason": "brief explanation",
  "categories": ["category1", "category2"] (from: government-contracts, mergers-acquisitions, c-suite, quarterly-filings, new-construction, expansion, layoffs, partnership, product-launch, regulation, grants, permits, stock, supply-chain, technology),
  "sentiment": "positive" | "negative" | "neutral",
  "sentimentScore": number (-1 to 1),
  "urgency": number (1-10, how time-sensitive),
  "extractedEntities": {
    "companies": [{"name": "Company Name", "ticker": "TICK", "confidence": 0.95}],
    "people": [{"name": "Person Name", "role": "CEO", "company": "Company"}],
    "locations": ["City, State"],
    "amounts": ["$500M", "2,000 jobs"]
  },
  "summary": "2-3 sentence executive summary",
  "keyPoints": ["point 1", "point 2", "point 3"]
}

Return ONLY valid JSON, no other text.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ArticleAnalysis;
    }
    
    throw new Error('No valid JSON in response');
  } catch (error) {
    console.error('Triage error:', error);
    // Return default analysis on error
    return {
      isRelevant: false,
      relevanceScore: 0,
      relevanceReason: 'Analysis failed',
      categories: [],
      sentiment: 'neutral',
      sentimentScore: 0,
      urgency: 1,
      extractedEntities: { companies: [], people: [], locations: [], amounts: [] },
      summary: title,
      keyPoints: [],
    };
  }
}

/**
 * Agent 2: Deep Business Analysis
 * Detailed analysis for high-priority articles
 */
export async function analyzeDeep(
  title: string,
  content: string,
  triageResult: ArticleAnalysis
): Promise<DeepAnalysis> {
  const prompt = `${LUPTON_CONTEXT}

You previously analyzed this article and found it relevant. Now provide DEEP BUSINESS ANALYSIS:

TITLE: ${title}
INITIAL ANALYSIS:
- Relevance Score: ${triageResult.relevanceScore}
- Categories: ${triageResult.categories.join(', ')}
- Key Companies: ${triageResult.extractedEntities.companies.map(c => c.name).join(', ')}
- Summary: ${triageResult.summary}

CONTENT: ${content}

Provide deep analysis in JSON format:
{
  "businessImpact": {
    "direct": "How this directly affects Lupton's business",
    "indirect": "Secondary effects and ripple impacts",
    "timeframe": "immediate/short-term/long-term"
  },
  "opportunities": [
    {
      "description": "Specific opportunity identified",
      "actionItem": "What Lupton should do",
      "priority": "high/medium/low",
      "assignTo": "Which team or role should handle this"
    }
  ],
  "risks": [
    {
      "description": "Potential risk identified",
      "mitigation": "How to mitigate",
      "severity": "high/medium/low"
    }
  ],
  "competitiveIntelligence": "What this tells us about competitors or market",
  "recommendedActions": [
    {
      "action": "Specific action to take",
      "owner": "Who should do it",
      "deadline": "When (e.g., 'within 48 hours', 'this week')"
    }
  ],
  "relatedTrends": ["trend1", "trend2"],
  "leadPotential": {
    "isNewLead": boolean,
    "companyName": "If new lead, company name",
    "sector": "Which sector",
    "rationale": "Why this is a good lead",
    "suggestedApproach": "How to approach them"
  }
}

Return ONLY valid JSON, no other text.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as DeepAnalysis;
    }
    
    throw new Error('No valid JSON in response');
  } catch (error) {
    console.error('Deep analysis error:', error);
    return {
      businessImpact: { direct: '', indirect: '', timeframe: 'unknown' },
      opportunities: [],
      risks: [],
      competitiveIntelligence: '',
      recommendedActions: [],
      relatedTrends: [],
    };
  }
}

/**
 * Agent 3: Company Matching
 * Match extracted companies to our database with disambiguation
 */
export async function matchCompanies(
  extractedCompanies: Array<{ name: string; ticker?: string; confidence: number }>
): Promise<Array<{ companyId: string; confidence: number; isPrimary: boolean }>> {
  const matches: Array<{ companyId: string; confidence: number; isPrimary: boolean }> = [];
  
  const dbCompanies = await prisma.company.findMany();
  
  for (const extracted of extractedCompanies) {
    const searchTerms = [
      extracted.name.toLowerCase(),
      extracted.ticker?.toLowerCase(),
    ].filter(Boolean);
    
    // Find best match
    let bestMatch: { company: typeof dbCompanies[0]; score: number } | null = null;
    
    for (const company of dbCompanies) {
      const identifiers = JSON.parse(company.searchIdentifiers || '[]') as string[];
      const allTerms = [
        company.name.toLowerCase(),
        company.shortName?.toLowerCase(),
        company.stockTicker?.toLowerCase(),
        ...identifiers,
      ].filter(Boolean);
      
      // Calculate match score
      let score = 0;
      for (const searchTerm of searchTerms) {
        if (!searchTerm) continue;
        for (const term of allTerms) {
          if (!term) continue;
          if (term === searchTerm) {
            score += 100;
          } else if (term.includes(searchTerm) || searchTerm.includes(term)) {
            score += 50;
          }
        }
      }
      
      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { company, score };
      }
    }
    
    if (bestMatch && bestMatch.score >= 50) {
      matches.push({
        companyId: bestMatch.company.id,
        confidence: Math.min(bestMatch.score / 100, 1) * extracted.confidence,
        isPrimary: extracted === extractedCompanies[0],
      });
    }
  }
  
  return matches;
}

/**
 * Full Pipeline: Process an article through all agents
 */
export async function processArticle(article: {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  source: string;
  url: string;
}): Promise<{
  analysis: ArticleAnalysis;
  deepAnalysis?: DeepAnalysis;
  companyMatches: Array<{ companyId: string; confidence: number; isPrimary: boolean }>;
}> {
  const content = article.content || article.summary || article.title;
  
  // Step 1: Triage
  const analysis = await triageArticle(article.title, content, article.source);
  
  // Step 2: Match companies
  const companyMatches = await matchCompanies(analysis.extractedEntities.companies);
  
  // Step 3: Deep analysis for high-relevance articles
  let deepAnalysis: DeepAnalysis | undefined;
  if (analysis.isRelevant && analysis.relevanceScore >= 70) {
    deepAnalysis = await analyzeDeep(article.title, content, analysis);
  }
  
  // Step 4: Save to database
  await prisma.newsArticle.update({
    where: { id: article.id },
    data: {
      relevanceScore: analysis.relevanceScore,
      sentiment: analysis.sentiment,
      sentimentScore: analysis.sentimentScore,
      categories: JSON.stringify(analysis.categories),
      aiSummary: analysis.summary,
      aiAnalysis: deepAnalysis ? JSON.stringify(deepAnalysis) : null,
      aiActionItems: deepAnalysis?.recommendedActions 
        ? JSON.stringify(deepAnalysis.recommendedActions) 
        : null,
      processed: true,
      processedAt: new Date(),
    },
  });
  
  // Step 5: Create company associations
  for (const match of companyMatches) {
    await prisma.articleCompany.upsert({
      where: {
        articleId_companyId: {
          articleId: article.id,
          companyId: match.companyId,
        },
      },
      update: { confidence: match.confidence, isPrimary: match.isPrimary },
      create: {
        articleId: article.id,
        companyId: match.companyId,
        confidence: match.confidence,
        isPrimary: match.isPrimary,
      },
    });
  }
  
  // Step 6: Create AI insight if warranted
  if (deepAnalysis && (deepAnalysis.opportunities.length > 0 || deepAnalysis.risks.length > 0)) {
    const insightType = deepAnalysis.opportunities.length > 0 ? 'OPPORTUNITY' : 'RISK';
    const primaryItem = insightType === 'OPPORTUNITY' 
      ? deepAnalysis.opportunities[0] 
      : deepAnalysis.risks[0];
    
    await prisma.aIInsight.create({
      data: {
        type: insightType,
        title: insightType === 'OPPORTUNITY' 
          ? `Opportunity: ${(primaryItem as any).description.slice(0, 100)}`
          : `Risk Alert: ${(primaryItem as any).description.slice(0, 100)}`,
        description: insightType === 'OPPORTUNITY'
          ? (primaryItem as any).actionItem
          : (primaryItem as any).mitigation,
        confidence: analysis.relevanceScore,
        impact: insightType === 'OPPORTUNITY' 
          ? (primaryItem as any).priority 
          : (primaryItem as any).severity,
        relatedSectors: JSON.stringify(analysis.categories),
        tags: JSON.stringify(analysis.keyPoints.slice(0, 5)),
        sourceArticleId: article.id,
      },
    });
  }
  
  // Step 7: Create prospect lead if identified
  if (deepAnalysis?.leadPotential?.isNewLead && deepAnalysis.leadPotential.companyName) {
    await prisma.prospectLead.create({
      data: {
        companyName: deepAnalysis.leadPotential.companyName,
        sourceType: 'news',
        sourceArticleId: article.id,
        sector: deepAnalysis.leadPotential.sector || analysis.categories[0] || 'general',
        aiRationale: deepAnalysis.leadPotential.rationale,
        suggestedApproach: deepAnalysis.leadPotential.suggestedApproach,
        status: 'new',
      },
    });
  }
  
  return { analysis, deepAnalysis, companyMatches };
}

/**
 * Generate personalized daily briefing for a user
 */
export async function generateUserBriefing(userId: string): Promise<string> {
  // Get user's assigned companies and preferences
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
      assignedCompanies: { include: { company: true } },
      team: true,
    },
  });
  
  if (!user) throw new Error('User not found');
  
  // Get recent articles for user's companies
  const companyIds = user.assignedCompanies.map(a => a.companyId);
  const recentArticles = await prisma.newsArticle.findMany({
    where: {
      companies: { some: { companyId: { in: companyIds } } },
      publishedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      relevanceScore: { gte: 50 },
    },
    orderBy: { relevanceScore: 'desc' },
    take: 20,
    include: { companies: { include: { company: true } } },
  });
  
  // Get recent insights
  const insights = await prisma.aIInsight.findMany({
    where: {
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      companies: { some: { companyId: { in: companyIds } } },
    },
    take: 5,
  });
  
  // Generate briefing with AI
  const prompt = `${LUPTON_CONTEXT}

Generate a personalized morning briefing for:
NAME: ${user.name}
ROLE: ${user.role}
TEAM: ${user.team?.name || 'General'}
ASSIGNED ACCOUNTS: ${user.assignedCompanies.map(a => a.company.name).join(', ')}

RECENT NEWS (last 24 hours):
${recentArticles.map(a => `- ${a.title} (Score: ${a.relevanceScore}, Companies: ${a.companies.map(c => c.company.name).join(', ')})`).join('\n')}

ACTIVE INSIGHTS:
${insights.map(i => `- [${i.type}] ${i.title}`).join('\n')}

Write a concise, actionable morning briefing (3-4 paragraphs) that:
1. Highlights the most important developments
2. Identifies immediate action items
3. Notes any risks or opportunities
4. Provides strategic context

Write in a professional but personable tone, addressing ${user.name.split(' ')[0]} directly.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Briefing generation error:', error);
    return `Good morning, ${user.name.split(' ')[0]}. We encountered an issue generating your personalized briefing. Please check the dashboard for the latest updates.`;
  }
}

export default {
  triageArticle,
  analyzeDeep,
  matchCompanies,
  processArticle,
  generateUserBriefing,
};
