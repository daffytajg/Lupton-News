export interface NewsSource {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  color: string;
}

export const NEWS_SOURCES: Record<string, NewsSource> = {
  'reuters': {
    id: 'reuters',
    name: 'Reuters',
    domain: 'reuters.com',
    color: '#FF6600',
  },
  'bloomberg': {
    id: 'bloomberg',
    name: 'Bloomberg',
    domain: 'bloomberg.com',
    color: '#000000',
  },
  'cnbc': {
    id: 'cnbc',
    name: 'CNBC',
    domain: 'cnbc.com',
    color: '#1E73BE',
  },
  'wsj': {
    id: 'wsj',
    name: 'Wall Street Journal',
    domain: 'wsj.com',
    color: '#000000',
  },
  'techcrunch': {
    id: 'techcrunch',
    name: 'TechCrunch',
    domain: 'techcrunch.com',
    color: '#0A9B00',
  },
  'cnn': {
    id: 'cnn',
    name: 'CNN Business',
    domain: 'cnn.com',
    color: '#CC0000',
  },
  'forbes': {
    id: 'forbes',
    name: 'Forbes',
    domain: 'forbes.com',
    color: '#000000',
  },
  'ft': {
    id: 'ft',
    name: 'Financial Times',
    domain: 'ft.com',
    color: '#FFF1E5',
  },
  'marketwatch': {
    id: 'marketwatch',
    name: 'MarketWatch',
    domain: 'marketwatch.com',
    color: '#006F39',
  },
  'businessinsider': {
    id: 'businessinsider',
    name: 'Business Insider',
    domain: 'businessinsider.com',
    color: '#E4181C',
  },
};

export function getSourceByName(sourceName: string): NewsSource | null {
  // Normalize source name
  const normalized = sourceName.toLowerCase().replace(/\s+/g, '');

  // Direct match
  const directMatch = Object.values(NEWS_SOURCES).find(
    s => s.name.toLowerCase().replace(/\s+/g, '') === normalized
  );
  if (directMatch) return directMatch;

  // Domain match
  const domainMatch = Object.values(NEWS_SOURCES).find(
    s => normalized.includes(s.domain.split('.')[0])
  );
  if (domainMatch) return domainMatch;

  // Return generic source
  return {
    id: 'generic',
    name: sourceName,
    domain: '',
    color: '#6B7280',
  };
}
