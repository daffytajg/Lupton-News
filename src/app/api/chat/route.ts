import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/claude';
import { fetchAllNews } from '@/lib/googleNews';

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

    // Fetch recent news for context
    let articles: any[] = [];
    try {
      articles = await fetchAllNews();
    } catch (error) {
      console.warn('Could not fetch news for context:', error);
    }

    // Convert history to expected format
    const conversationHistory = history.map((msg: { role: string; content: string }) => ({
      id: `hist-${Date.now()}-${Math.random()}`,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(),
    }));

    // Get AI response
    const response = await chat(message, conversationHistory, {
      articles: articles.slice(0, 20), // Pass top 20 articles for context
    });

    return NextResponse.json({
      success: true,
      response,
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
