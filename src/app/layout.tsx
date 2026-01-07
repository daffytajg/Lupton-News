import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
