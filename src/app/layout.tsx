import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/Footer';
import { AIChatAssistant } from '@/components/AIChatAssistant';
import { StockTicker } from '@/components/StockTicker';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'Lupton News Intelligence | OEM & Customer News Alerts',
  description: 'AI-powered news monitoring and alerts for Lupton Associates OEMs, customers, and principals across Datacenter, Heavy Trucks, Military & Aerospace, Robotics, and Medical sectors.',
  keywords: 'manufacturing, OEM, news alerts, business intelligence, Lupton Associates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <StockTicker />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <AIChatAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
