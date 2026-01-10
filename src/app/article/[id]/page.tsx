'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Calendar,
  Building2,
  Tag,
  TrendingUp,
  TrendingDown,
  Minus,
  Bookmark,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { MOCK_NEWS, MOCK_AI_INSIGHTS } from '@/data/mockNews';
import { ALL_COMPANY_ARTICLES } from '@/data/allCompanyArticles';
import { COMPANIES } from '@/data/companies';
import { SECTORS, NEWS_CATEGORIES } from '@/data/sectors';
import { useState } from 'react';

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const articleId = params.id as string;
  // Search in both MOCK_NEWS and ALL_COMPANY_ARTICLES
  const article = MOCK_NEWS.find(a => a.id === articleId) || ALL_COMPANY_ARTICLES.find(a => a.id === articleId);
  
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const relatedCompanies = article.companies
    .map(id => COMPANIES.find(c => c.id === id))
    .filter(Boolean);
  
  const relatedSectors = article.sectors
    .map(id => SECTORS.find(s => s.id === id))
    .filter(Boolean);

  const categoryInfo = article.categories
    .map(cat => NEWS_CATEGORIES.find(c => c.id === cat))
    .filter(Boolean);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSentimentColor = () => {
    switch (article.sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  // Related articles from same companies or sectors - search both sources
  const allArticles = [...MOCK_NEWS, ...ALL_COMPANY_ARTICLES];
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id)
    .filter(a => 
      a.companies.some(c => article.companies.includes(c)) ||
      a.sectors.some(s => article.sectors.includes(s))
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {showShareToast && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          Link copied to clipboard!
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Share article"
            >
              <Share2 className="w-5 h-5" />
            </button>
            {article.sourceUrl && (
              <a 
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Article header */}
          <div className="p-8 border-b border-gray-100">
            {/* Categories and breaking badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {article.isBreaking && (
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Breaking
                </span>
              )}
              {categoryInfo.map(cat => cat && (
                <span 
                  key={cat.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {cat.icon} {cat.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="font-medium text-gray-700">{article.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              {article.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
              )}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getSentimentColor()}`}>
                {getSentimentIcon()}
                <span className="capitalize text-xs font-medium">{article.sentiment}</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                <span className="text-xs font-medium">{article.relevanceScore}% Relevant</span>
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="p-8">
            {/* Summary */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {article.summary}
              </p>
              
              {/* Extended content - simulated for demo */}
              <p className="text-gray-600 leading-relaxed mb-4">
                This development represents a significant milestone for the industry and could have far-reaching implications 
                for manufacturers' representatives like Lupton Associates. The announcement comes at a time when the sector 
                is experiencing unprecedented growth and transformation.
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                Industry analysts have noted that this move aligns with broader market trends and positions the company 
                favorably for the coming fiscal year. Stakeholders across the supply chain are closely monitoring the 
                situation for potential opportunities.
              </p>

              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">
                "This is exactly the type of development that our intelligence platform is designed to surface for 
                Lupton Associates' sales teams," said the AI analysis system. "Early awareness of such news enables 
                proactive customer engagement."
              </blockquote>

              <p className="text-gray-600 leading-relaxed">
                For more detailed information and ongoing coverage, visit the original source or contact your 
                assigned sales representative for a briefing on how this news may affect your accounts.
              </p>
            </div>

            {/* AI Insights section */}
            {article.aiInsights && article.aiInsights.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  {article.aiInsights.map(insight => (
                    <div key={insight.id} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          insight.type === 'opportunity' ? 'bg-green-100 text-green-800' :
                          insight.type === 'risk' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {insight.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full max-w-[100px]">
                          <div 
                            className="h-2 bg-purple-500 rounded-full" 
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-purple-600">{insight.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with related info */}
          <div className="p-8 bg-gray-50 border-t border-gray-100">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Related Companies */}
              {relatedCompanies.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    Companies Mentioned
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedCompanies.map(company => company && (
                      <Link
                        key={company.id}
                        href={`/companies/${company.id}`}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
                      >
                        {company.name}
                        {company.ticker && (
                          <span className="ml-1 text-gray-400">({company.ticker})</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Sectors */}
              {relatedSectors.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                    <Tag className="w-5 h-5 text-gray-500" />
                    Sectors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedSectors.map(sector => sector && (
                      <Link
                        key={sector.id}
                        href={`/sectors/${sector.id}`}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                      >
                        <span className="mr-1">{sector.icon}</span>
                        <span className="font-medium text-gray-700">{sector.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feedback section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Was this article relevant to you?</p>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-sm">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span>Yes, helpful</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors text-sm">
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  <span>Not relevant</span>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map(relatedArticle => (
                <Link
                  key={relatedArticle.id}
                  href={`/article/${relatedArticle.id}`}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {relatedArticle.sectors.slice(0, 1).map(sectorId => {
                      const sector = SECTORS.find(s => s.id === sectorId);
                      return sector && (
                        <span key={sector.id} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          {sector.icon} {sector.shortName}
                        </span>
                      );
                    })}
                    <span className="text-xs text-gray-400">{relatedArticle.source}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                    {relatedArticle.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {relatedArticle.summary}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
