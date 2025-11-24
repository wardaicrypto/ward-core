# Ward AI - AI-Powered Token Security Platform

Ward AI is a real-time security platform that protects token launches from market manipulation, insider threats, and predatory trading practices on DEX platforms.

## Features

### 🔍 Real-Time Token Analysis
- Analyze any Solana token by contract address
- AI-powered risk assessment using GPT-4
- Detection of pump-and-dump schemes, rug pulls, and insider trading
- Real-time data from DexScreener API

### 🚨 Live Alert System
- AI-generated security alerts from trending tokens
- Continuous monitoring of suspicious trading patterns
- Real-time threat classification (critical, warning, info, success)

### 📊 Market Intelligence
- Trending tokens with live price data
- 24h volume, price changes, and liquidity metrics
- Direct links to analyze any token
- Integration with DexScreener for accurate DEX data

### 🛡️ Security Modules
- **Insider Selling Detection** - Monitor wallet activity during launches
- **Liquidity Drain Prevention** - Alert on suspicious liquidity movements
- **Deployer LP Withdrawal Guard** - Protect against rug pulls
- **Sniper Volume Detection** - Identify artificial volume cycling

## How It Works

### 1. Token Search & Analysis
Enter any Solana token contract address in the search bar. Ward AI will:
- Fetch real-time trading data from DexScreener
- Analyze price volatility, volume, liquidity, and trading patterns
- Use AI (GPT-4) to detect manipulation indicators
- Generate a comprehensive risk score (0-100)
- Provide specific threat details and recommendations

### 2. AI-Powered Detection
Ward AI uses the Vercel AI SDK with GPT-4 to analyze:
- Unusual price movements and volatility patterns
- Low liquidity relative to market cap (rug pull indicators)
- Suspicious buy/sell ratios
- Age-related risks for newly launched tokens
- Holder concentration and insider activity

### 3. Real-Time Monitoring
- Fetches trending tokens from DexScreener every 2 minutes
- Generates AI security alerts every 30 seconds
- Updates threat detection charts with live data
- Continuous monitoring of active tokens

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Vercel AI SDK v5** - AI-powered analysis (GPT-4, GPT-4o-mini)
- **DexScreener API** - Real-time DEX trading data
- **Tailwind CSS v4** - Styling with design tokens
- **Recharts** - Data visualization
- **shadcn/ui** - UI components

## API Routes

### `/api/analyze-token`
Analyzes a token using AI and returns:
- Risk score and level (low/medium/high/critical)
- Detected threats with severity and confidence
- Security metrics (insider activity, liquidity health, etc.)
- Actionable recommendations

### `/api/trending-tokens`
Fetches trending tokens from DexScreener with:
- Price, volume, and liquidity data
- 24h price changes
- Direct links to token pairs

### `/api/live-alerts`
Generates AI-powered security alerts from recent tokens:
- Real-time threat classification
- Specific security concerns
- Token details and timestamps

## Getting Started

1. **Search for a token**: Enter a Solana contract address in the search bar
2. **View analysis**: Get instant AI-powered risk assessment
3. **Monitor alerts**: Watch live security alerts for trending tokens
4. **Explore trending**: Check trending tokens and analyze them

## Environment Setup

No API keys required! Ward AI uses the Vercel AI Gateway which provides:
- OpenAI GPT-4 and GPT-4o-mini access
- No rate limiting in development
- Automatic model routing

## Future Enhancements

- Multi-chain support (Ethereum, BSC, Base, etc.)
- Historical analysis and pattern detection
- Wallet tracking and watchlists
- Telegram/Discord alert integrations
- Custom alert rules and thresholds
- Portfolio protection mode

## Notes

- Currently supports Solana tokens via DexScreener
- AI analysis requires active trading pairs
- Alert generation happens every 30 seconds
- Trending tokens refresh every 2 minutes

---

Built with ❤️ using v0 by Vercel
