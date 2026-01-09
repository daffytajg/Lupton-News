import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/claude';
import { MOCK_NEWS, MOCK_AI_INSIGHTS, MOCK_PREDICTIONS, MOCK_ALERTS } from '@/data/mockNews';
import { COMPANIES, SALES_TEAMS } from '@/data/companies';
import { SECTORS } from '@/data/sectors';

// Build comprehensive context for the AI
function buildContext() {
  // Get recent news
  const recentNews = MOCK_NEWS.slice(0, 15).map(article => ({
    title: article.title,
    summary: article.summary,
    source: article.source,
    sectors: article.sectors,
    companies: article.companies,
    sentiment: article.sentiment,
    relevanceScore: article.relevanceScore,
    categories: article.categories,
  }));

  // Get AI insights
  const insights = MOCK_AI_INSIGHTS.map(insight => ({
    type: insight.type,
    title: insight.title,
    description: insight.description,
    sectors: insight.relatedSectors,
    companies: insight.relatedCompanies,
    confidence: insight.confidence,
  }));

  // Get predictions
  const predictions = MOCK_PREDICTIONS.map(pred => ({
    title: pred.title,
    description: pred.description,
    probability: pred.probability,
    timeframe: pred.timeframe,
    sectors: pred.relatedSectors,
  }));

  // Get alerts
  const alerts = MOCK_ALERTS.slice(0, 5).map(alert => ({
    type: alert.type,
    priority: alert.priority,
    title: alert.title,
    message: alert.message,
  }));

  // Get sector summaries
  const sectorSummaries = SECTORS.map(sector => ({
    id: sector.id,
    name: sector.name,
    description: sector.description,
    articleCount: MOCK_NEWS.filter(n => n.sectors.includes(sector.id)).length,
  }));

  // Get company info
  const companyInfo = COMPANIES.slice(0, 20).map(company => ({
    id: company.id,
    name: company.name,
    type: company.type,
    sectors: company.sectors,
    ticker: company.ticker,
  }));

  return {
    recentNews,
    insights,
    predictions,
    alerts,
    sectorSummaries,
    companyInfo,
    salesTeams: SALES_TEAMS.map(t => ({ name: t.name, members: t.members?.length || 0 })),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build comprehensive context
    const context = buildContext();

    // Convert history to expected format
    const conversationHistory = history.map((msg: { role: string; content: string }) => ({
      id: `hist-${Date.now()}-${Math.random()}`,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(),
    }));

    // Create enhanced articles array with full context
    const articlesWithContext = MOCK_NEWS.slice(0, 20).map(article => ({
      ...article,
      // Add company names for better context
      companyNames: article.companies.map(id => 
        COMPANIES.find(c => c.id === id)?.name || id
      ),
      // Add sector names
      sectorNames: article.sectors.map(id =>
        SECTORS.find(s => s.id === id)?.name || id
      ),
    }));

    // Get AI response with enhanced context
    const response = await chat(message, conversationHistory, {
      articles: articlesWithContext,
    });

    // If the response is generic, enhance it with specific data
    let enhancedResponse = response;
    const lowerMessage = message.toLowerCase();

    // Check if we should add specific data to the response
    if (lowerMessage.includes('datacenter') || lowerMessage.includes('data center')) {
      const datacenterNews = MOCK_NEWS.filter(n => n.sectors.includes('datacenter'));
      const datacenterInsights = MOCK_AI_INSIGHTS.filter(i => i.relatedSectors.includes('datacenter'));
      if (datacenterNews.length > 0 || datacenterInsights.length > 0) {
        enhancedResponse += `\n\n**Current Datacenter Sector Activity:**\n`;
        datacenterNews.slice(0, 3).forEach(n => {
          enhancedResponse += `• ${n.title} (${n.sentiment})\n`;
        });
        if (datacenterInsights.length > 0) {
          enhancedResponse += `\n**Key Insight:** ${datacenterInsights[0].description}`;
        }
      }
    }

    if (lowerMessage.includes('defense') || lowerMessage.includes('military') || lowerMessage.includes('aerospace')) {
      const defenseNews = MOCK_NEWS.filter(n => n.sectors.includes('military-aerospace'));
      if (defenseNews.length > 0) {
        enhancedResponse += `\n\n**Current Defense/Aerospace Activity:**\n`;
        defenseNews.slice(0, 3).forEach(n => {
          enhancedResponse += `• ${n.title} (${n.sentiment})\n`;
        });
      }
    }

    if (lowerMessage.includes('robot') || lowerMessage.includes('automation')) {
      const roboticsNews = MOCK_NEWS.filter(n => n.sectors.includes('robotics-automation'));
      const roboticsInsights = MOCK_AI_INSIGHTS.filter(i => i.relatedSectors.includes('robotics-automation'));
      if (roboticsNews.length > 0 || roboticsInsights.length > 0) {
        enhancedResponse += `\n\n**Current Robotics & Automation Activity:**\n`;
        roboticsNews.slice(0, 3).forEach(n => {
          enhancedResponse += `• ${n.title} (${n.sentiment})\n`;
        });
        if (roboticsInsights.length > 0) {
          enhancedResponse += `\n**Key Insight:** ${roboticsInsights[0].description}`;
        }
      }
    }

    if (lowerMessage.includes('truck') || lowerMessage.includes('heavy')) {
      const truckNews = MOCK_NEWS.filter(n => n.sectors.includes('heavy-trucks'));
      if (truckNews.length > 0) {
        enhancedResponse += `\n\n**Current Heavy Trucks Activity:**\n`;
        truckNews.slice(0, 3).forEach(n => {
          enhancedResponse += `• ${n.title} (${n.sentiment})\n`;
        });
      }
    }

    if (lowerMessage.includes('medical') || lowerMessage.includes('health') || lowerMessage.includes('scientific')) {
      const medicalNews = MOCK_NEWS.filter(n => n.sectors.includes('medical-scientific'));
      if (medicalNews.length > 0) {
        enhancedResponse += `\n\n**Current Medical & Scientific Activity:**\n`;
        medicalNews.slice(0, 3).forEach(n => {
          enhancedResponse += `• ${n.title} (${n.sentiment})\n`;
        });
      }
    }

    if (lowerMessage.includes('trend') || lowerMessage.includes('prediction')) {
      enhancedResponse += `\n\n**Current Predictions & Trends:**\n`;
      MOCK_PREDICTIONS.slice(0, 3).forEach(p => {
        enhancedResponse += `• ${p.title} (${p.probability}% probability, ${p.timeframe})\n`;
      });
    }

    if (lowerMessage.includes('alert') || lowerMessage.includes('breaking') || lowerMessage.includes('urgent')) {
      const criticalAlerts = MOCK_ALERTS.filter(a => a.priority === 'critical' || a.priority === 'high');
      if (criticalAlerts.length > 0) {
        enhancedResponse += `\n\n**Priority Alerts:**\n`;
        criticalAlerts.slice(0, 3).forEach(a => {
          enhancedResponse += `• [${a.priority.toUpperCase()}] ${a.title}: ${a.message}\n`;
        });
      }
    }

    return NextResponse.json({
      success: true,
      response: enhancedResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
