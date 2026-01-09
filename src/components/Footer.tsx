'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Cloud } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-900 text-gray-400 py-6 px-6 ${className || ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Lupton branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] flex items-center justify-center border border-gray-700">
              <Image
                src="/lupton-logo.png"
                alt="Lupton Associates"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <p className="font-semibold text-white">Lupton News Intelligence</p>
              <a 
                href="https://www.luptons.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
              >
                www.luptons.com
              </a>
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/companies" className="hover:text-white transition-colors">Companies</Link>
            <Link href="/insights" className="hover:text-white transition-colors">AI Insights</Link>
            <Link href="/alerts" className="hover:text-white transition-colors">Alerts</Link>
            <Link href="/help" className="hover:text-white transition-colors">Help</Link>
          </div>

          {/* Right - Credits */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 text-sm">
              <span>Built by</span>
              <span className="font-semibold text-white">Joe Guadagnino</span>
              <span className="text-gray-600">|</span>
              <span className="flex items-center gap-1">
                With
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-blue-400 font-medium">Google Cloud</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              © {currentYear} Lupton Associates. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
