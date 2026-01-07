# Lupton News Intelligence Platform

AI-powered news monitoring and alerting system for Lupton Associates OEMs, customers, and principals.

## Overview

Lupton News Intelligence is a comprehensive business intelligence platform designed specifically for Lupton Associates, a manufacturers representative organization specializing in custom engineered components. The platform monitors news across 5 key industry sectors and provides AI-powered insights, predictive analytics, and personalized alerts.

## Key Features

### 📰 Smart News Aggregation
- Real-time news monitoring from 500+ sources
- AI-powered relevance scoring (filters out charity events, sports donations, and irrelevant news)
- Focus on business-critical news categories:
  - Government Contracts
  - Mergers & Acquisitions
  - Quarterly Filings (10-Q, 10-K)
  - C-Suite Changes
  - New Construction & Permits
  - Large Grants
  - Bankruptcy/Restructuring
  - Product Launches
  - Partnerships

### 🏢 5 Industry Sectors
1. **Datacenter & Computing** - Data centers, cloud computing, servers, GPUs
2. **Heavy Trucks** - Commercial vehicles, heavy-duty trucks, trailers
3. **Military & Aerospace** - Defense contractors, aerospace, government contracts
4. **Robotics & Automation** - Industrial robotics, automation systems, machine vision
5. **Medical & Scientific** - Medical devices, scientific instruments, life sciences

### 🤖 AI-Powered Features
- **Relevance Scoring**: Automatic filtering of noise vs. signal
- **Sentiment Analysis**: Positive/negative/neutral classification
- **Predictive Signals**: ML-based predictions on M&A, market trends
- **Pattern Recognition**: Correlation detection across news events
- **Risk Alerts**: Early warning system for supply chain and market risks

### 🔔 Personalized Notifications
- Employee-specific alert routing based on assigned accounts
- Priority-based filtering (Critical, High, Medium, Low)
- Multiple channels: Email, Push, SMS
- Customizable category preferences

### 📧 Daily Email Digest
- Comprehensive daily summary
- Top stories across all sectors
- Company-specific updates
- AI insights and predictions
- Stock movers for tracked companies
- Customizable delivery time and frequency

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **Icons**: Lucide React
- **Email**: Resend (ready for integration)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── alerts/       # Alert management
│   │   ├── email-digest/ # Email digest generation
│   │   └── news/         # News fetching & filtering
│   ├── alerts/           # Alerts page
│   ├── companies/        # Companies directory
│   ├── email-digest/     # Email digest preview
│   ├── insights/         # AI insights dashboard
│   ├── sectors/[sector]/ # Dynamic sector pages
│   └── settings/         # User settings
├── components/            # React components
│   ├── AIInsightsPanel   # AI insights display
│   ├── Header            # Navigation header with stock ticker
│   ├── NewsCard          # News article cards
│   ├── Sidebar           # Navigation sidebar
│   └── StatsCards        # Dashboard statistics
├── data/                  # Static data
│   ├── companies.ts      # OEM/Customer database
│   ├── mockNews.ts       # Sample news data
│   └── sectors.ts        # Sector definitions & filter keywords
├── hooks/                 # Custom React hooks
│   └── useStore.ts       # Zustand store
├── lib/                   # Utility functions
│   ├── ai.ts             # AI analysis utilities
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript types
    └── index.ts          # Type definitions
```

## OEM/Customer Database

The platform tracks 40+ companies across the 5 sectors, including:

**Datacenter**: NVIDIA, Intel, AMD, Dell, HPE, Supermicro, Vertiv, Equinix
**Heavy Trucks**: PACCAR, Daimler Truck, Volvo, Navistar, Cummins, Allison, Wabash
**Military & Aerospace**: Lockheed Martin, RTX, Northrop Grumman, Boeing, General Dynamics, L3Harris, BAE, Textron
**Robotics**: FANUC, ABB, KUKA, Rockwell, Siemens, Cognex, Keyence, Tesla
**Medical**: Medtronic, Abbott, Boston Scientific, Stryker, Thermo Fisher, Danaher, Intuitive Surgical

## News Filtering Logic

### Keywords that MATTER (prioritized):
- Government contracts, federal contracts, DOD, Pentagon
- Merger, acquisition, takeover, buyout
- Bankruptcy, Chapter 11, restructuring
- New facility, plant expansion, groundbreaking
- CEO, CFO, appointed, resigned
- 10-Q, 10-K, quarterly earnings
- Grant, funding, subsidy

### Keywords FILTERED OUT (garbage):
- Charity, donation, philanthropic
- Sports sponsorship, golf tournament
- Volunteer, community event
- Best places to work, employee satisfaction
- Team building, office renovation

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

```env
# Email service (Resend)
RESEND_API_KEY=your_api_key

# News API (for production news aggregation)
NEWS_API_KEY=your_news_api_key

# Database (if using external DB)
DATABASE_URL=your_database_url
```

## API Endpoints

### News
- `GET /api/news` - Fetch filtered news articles
- `POST /api/news` - Analyze new article
- `PUT /api/news` - Get sector/company specific news

### Alerts
- `GET /api/alerts` - Fetch user alerts
- `POST /api/alerts` - Manage alerts (mark read, delete, create)
- `PUT /api/alerts` - Generate alerts from preferences

### Email Digest
- `GET /api/email-digest` - Preview/generate digest
- `POST /api/email-digest` - Send digest

## Future Enhancements

- [ ] Real-time news aggregation via RSS/API
- [ ] Integration with financial data APIs (Alpha Vantage, Polygon)
- [ ] Push notification service (Firebase, OneSignal)
- [ ] Mobile app (React Native)
- [ ] Slack/Teams integration
- [ ] Custom alert rules builder
- [ ] Report generation and export
- [ ] Multi-tenant support for team management

## License

Proprietary - Lupton Associates

---

Built with ❤️ for Lupton Associates
