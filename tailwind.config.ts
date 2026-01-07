import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lupton Associates Brand Colors
        lupton: {
          navy: '#1e3a5f',
          blue: '#2563eb',
          light: '#3b82f6',
          accent: '#0ea5e9',
          gold: '#f59e0b',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
        // Sector Colors
        sector: {
          datacenter: '#6366f1',
          trucks: '#f97316',
          military: '#22c55e',
          robotics: '#8b5cf6',
          medical: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
