'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockData {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
}

export function StockTicker() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch stock data for Lupton customer companies
    fetchStockData();

    // Refresh every 60 seconds
    const interval = setInterval(fetchStockData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStockData = async () => {
    try {
      // In production, this would call a real stock API
      // For now, using mock data based on actual tickers
      const mockStocks: StockData[] = [
        { ticker: 'TXT', companyName: 'Textron (E-Z-GO)', price: 68.42, change: -0.52, changePercent: -0.75 },
        { ticker: 'DE', companyName: 'Deere & Company', price: 412.89, change: 2.15, changePercent: 0.52 },
        { ticker: 'NOC', companyName: 'Northrop Grumman', price: 478.33, change: -3.21, changePercent: -0.67 },
        { ticker: 'LMT', companyName: 'Lockheed Martin', price: 524.77, change: 1.88, changePercent: 0.36 },
        { ticker: 'LHX', companyName: 'L3Harris', price: 237.45, change: -1.12, changePercent: -0.47 },
        { ticker: 'HON', companyName: 'Honeywell', price: 215.68, change: 0.95, changePercent: 0.44 },
        { ticker: 'CAT', companyName: 'Caterpillar', price: 348.22, change: 5.43, changePercent: 1.58 },
        { ticker: 'EMR', companyName: 'Emerson Electric', price: 118.34, change: 0.22, changePercent: 0.19 },
        { ticker: 'PII', companyName: 'Polaris', price: 76.89, change: -0.88, changePercent: -1.13 },
        { ticker: 'AGCO', companyName: 'AGCO', price: 89.56, change: 1.34, changePercent: 1.52 },
        { ticker: 'SNPO', companyName: 'Snap One', price: 14.23, change: 0.15, changePercent: 1.07 },
        { ticker: 'BDX', companyName: 'Becton Dickinson', price: 234.78, change: -0.67, changePercent: -0.28 },
      ];

      setStocks(mockStocks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 border-b border-gray-800 py-2 px-4">
        <div className="flex items-center gap-8 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-12 bg-gray-800 rounded"></div>
              <div className="h-4 w-16 bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-b border-gray-800 overflow-hidden">
      <div className="relative h-10">
        {/* Scrolling ticker */}
        <div className="absolute inset-0 flex items-center">
          <div className="flex gap-8 animate-scroll whitespace-nowrap px-4">
            {/* Duplicate stocks for seamless loop */}
            {[...stocks, ...stocks].map((stock, index) => (
              <div
                key={`${stock.ticker}-${index}`}
                className="flex items-center gap-2 text-sm"
              >
                <span className="font-semibold text-blue-400">{stock.ticker}</span>
                <span className="text-white font-medium">${stock.price.toFixed(2)}</span>
                <div
                  className={cn(
                    'flex items-center gap-1',
                    stock.change > 0 ? 'text-green-400' : stock.change < 0 ? 'text-red-400' : 'text-gray-400'
                  )}
                >
                  {stock.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stock.change < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  <span className="font-medium">
                    {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default StockTicker;
