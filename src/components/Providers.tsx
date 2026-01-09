'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/components/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
