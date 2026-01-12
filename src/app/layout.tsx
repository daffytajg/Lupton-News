import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Footer } from '@/components/Footer';
import { AIChatAssistant } from '@/components/AIChatAssistant';
import { StockTicker } from '@/components/StockTicker';
import { AppSidebar } from '@/components/AppSidebar';

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
        <Providers>
          {/* Persistent Sidebar - visible on lg screens and up */}
          <AppSidebar />
          
          {/* Main Content Area - offset by sidebar width on lg screens */}
          <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
            <StockTicker />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
          
          <AIChatAssistant />
        </Providers>
      </body>
    </html>
  );
}
