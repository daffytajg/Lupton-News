'use client';

import { Cloud } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-gray-900 text-gray-400 py-4 px-6 ${className || ''}`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-white">Lupton News</span>
          <span className="text-gray-600">|</span>
          <span>Built by Joe Guadagnino</span>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1">
            Using
            <Cloud className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">Google Cloud</span>
          </span>
        </div>
        <div className="text-xs text-gray-500">
          © {currentYear} Lupton Associates. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
