import { Shield, AlertTriangle, TrendingUp, Activity, Lock, Eye, Zap, Network, Bell, BarChart3, Clock, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import MarketGuardHeader from '@/components/market-guard-header'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketGuardHeader />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Ward AI Documentation</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-powered market manipulation detection for decentralized token launches
          </p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">What is Ward AI?</h2>
          <Card className="p-6 bg-card/50">
            <p className="text-lg leading-relaxed mb-4">
              Ward AI is a real-time security platform designed to protect cryptocurrency token launches from market manipulation, 
              insider threats, and predatory trading practices. Built specifically for DEX platforms like PumpFun and Raydium, 
              Ward AI uses advanced rule-based algorithms to analyze trading patterns and detect suspicious activities.
            </p>
            <p className="text-lg leading-relaxed">
              The platform focuses on Solana tokens and integrates directly with DexScreener's API to provide instant 
              risk assessments, live security alerts, and comprehensive threat detection for token traders and investors.
            </p>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How Ward AI Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">1. Data Collection</h3>
              </div>
              <p className="text-muted-foreground">
                Ward AI fetches real-time trading data from DexScreener including price movements, volume, liquidity, 
                transactions, and holder information for Solana tokens.
              </p>
            </Card>

            <Card className="p-6 bg-card/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">2. Pattern Analysis</h3>
              </div>
              <p className="text-muted-foreground">
                Advanced algorithms analyze volatility patterns, liquidity ratios, buy/sell pressure, token age, 
                and volume distribution to identify manipulation indicators.
              </p>
            </Card>

            <Card className="p-6 bg-card/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">3. Threat Detection</h3>
              </div>
              <p className="text-muted-foreground">
                Multi-factor risk scoring identifies specific threats like pump-and-dump schemes, rug pulls, 
                insider trading, and artificial volume with confidence scores.
              </p>
            </Card>

            <Card className="p-6 bg-card/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">4. Real-Time Alerts</h3>
              </div>
              <p className="text-muted-foreground">
                Continuous monitoring generates instant alerts for suspicious activities with severity classification 
                and actionable recommendations for traders.
              </p>
            </Card>
          </div>
        </section>

        {/* Current Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Current Features</h2>
          
          <div className="space-y-6">
            {/* Token Analysis */}
            <Card className="p-6 bg-card/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Real-Time Token Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive security analysis for any Solana token address with instant risk assessment.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Risk scoring from 0-100 based on multi-factor analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Insider activity tracking and wallet monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Liquidity health assessment and rug pull detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Holder concentration analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Trading volume analysis and manipulation detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Price volatility pattern recognition</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Security Modules */}
            <Card className="p-6 bg-card/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Active Detection Modules</h3>
                  <p className="text-muted-foreground mb-4">
                    Four specialized security modules running 24/7 to protect against common attack vectors.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-background/50 border border-border">
                      <Eye className="h-5 w-5 text-primary mb-2" />
                      <h4 className="font-semibold mb-1">Insider Selling Detection</h4>
                      <p className="text-xs text-muted-foreground">
                        Real-time monitoring of insider wallet activity during token launches
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-border">
                      <TrendingUp className="h-5 w-5 text-primary mb-2" />
                      <h4 className="font-semibold mb-1">Liquidity Drain Prevention</h4>
                      <p className="text-xs text-muted-foreground">
                        Automatic alerts on suspicious liquidity movements and draining
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-border">
                      <Lock className="h-5 w-5 text-primary mb-2" />
                      <h4 className="font-semibold mb-1">Deployer LP Guard</h4>
                      <p className="text-xs text-muted-foreground">
                        Protection against deployer LP withdrawal attacks and rug pulls
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50 border border-border">
                      <Zap className="h-5 w-5 text-primary mb-2" />
                      <h4 className="font-semibold mb-1">Sniper Volume Detection</h4>
                      <p className="text-xs text-muted-foreground">
                        Identifies and prevents artificial volume cycling from bots
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Live Alerts */}
            <Card className="p-6 bg-card/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Live System Alerts</h3>
                  <p className="text-muted-foreground mb-4">
                    Real-time security monitoring with contextual alerts from actively traded tokens.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Priority-based threat classification (Critical, Warning, Info, Success)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Clickable token addresses linking to Solscan explorer</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>15-second refresh interval for real-time monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Scrollable feed with fixed height for better UX</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Trending Tokens */}
            <Card className="p-6 bg-card/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Trending Tokens Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Top 10 trending Solana tokens by volume with comprehensive trading metrics.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Real-time price, volume, and liquidity data from DexScreener</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Multiple timeframe price changes (5M, 1H, 6H, 24H)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Transaction counts and unique maker statistics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Direct analyze links for instant security assessment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Auto-refresh every 2 minutes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Threat Detection Overview */}
            <Card className="p-6 bg-card/50">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3">Threat Detection Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    24-hour monitoring dashboard with real-time threat visualization and metrics.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Live threat count with peak detection tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Real-time success rate calculation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Average response time monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Interactive area chart with 24-hour timeline</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Roadmap */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Development Roadmap 2025-2026</h2>
          
          <div className="space-y-8">
            {/* Q1 2025 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default" className="text-sm">Phase 1</Badge>
                <h3 className="text-xl font-semibold">Foundation & Core Features</h3>
              </div>
              <Card className="p-6 bg-card/50">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Wallet Integration</span>
                      <p className="text-sm text-muted-foreground">Connect Phantom, Solflare, and Backpack wallets for personalized alerts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Custom Alert Rules</span>
                      <p className="text-sm text-muted-foreground">Set custom thresholds for liquidity, volume, and price movements</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Token Watchlist</span>
                      <p className="text-sm text-muted-foreground">Create and monitor custom lists of tokens with priority alerts</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Historical Analysis</span>
                      <p className="text-sm text-muted-foreground">7-day and 30-day historical threat detection and pattern recognition</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Q2 2025 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">Phase 2</Badge>
                <h3 className="text-xl font-semibold">Advanced Analytics & AI</h3>
              </div>
              <Card className="p-6 bg-card/50">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Portfolio Protection Mode</span>
                      <p className="text-sm text-muted-foreground">Automatic monitoring of your entire wallet holdings</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Smart Contract Audit Scanner</span>
                      <p className="text-sm text-muted-foreground">Automated smart contract vulnerability detection</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Social Sentiment Analysis</span>
                      <p className="text-sm text-muted-foreground">Twitter/X and Reddit sentiment tracking for tokens</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Machine Learning Models</span>
                      <p className="text-sm text-muted-foreground">Custom ML models trained on historical manipulation patterns</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Q3 2025 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">Phase 3</Badge>
                <h3 className="text-xl font-semibold">Advanced Trading Platform</h3>
              </div>
              <Card className="p-6 bg-card/50">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Professional Trading Terminal</span>
                      <p className="text-sm text-muted-foreground">Axiom-style trading interface with real-time charts and order books</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Volume-Based Airdrop System</span>
                      <p className="text-sm text-muted-foreground">Earn WARD token airdrops every 6 months based on trading volume</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Token Discovery Dashboard</span>
                      <p className="text-sm text-muted-foreground">Discover new pairs, trending tokens with AI-verified safety scores</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Safe Trading with Rug Pull Alert</span>
                      <p className="text-sm text-muted-foreground">Automatic stop loss from entry when enabled by trader with Phase 2 AI features integrated for real-time rug pull detection and smart contract security</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Q3-Q4 2025 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">Phase 4</Badge>
                <h3 className="text-xl font-semibold">Multi-Chain & Integrations</h3>
              </div>
              <Card className="p-6 bg-card/50">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Ethereum & Base Support</span>
                      <p className="text-sm text-muted-foreground">Expand to Uniswap and Base DEXs with Ethereum token analysis</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Telegram Bot Integration</span>
                      <p className="text-sm text-muted-foreground">Real-time alerts delivered to Telegram with inline analysis</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Discord Bot</span>
                      <p className="text-sm text-muted-foreground">Community server integration with slash commands</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">API Access</span>
                      <p className="text-sm text-muted-foreground">Public API for developers to integrate Ward AI into their platforms</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Q4 2025 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-sm">Phase 5</Badge>
                <h3 className="text-xl font-semibold">Community & Ecosystem</h3>
              </div>
              <Card className="p-6 bg-card/50">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Community Reputation System</span>
                      <p className="text-sm text-muted-foreground">User-submitted reports and verified threat database</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Token Launchpad Integration</span>
                      <p className="text-sm text-muted-foreground">Partner with launchpads for pre-launch audits</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Mobile App (iOS & Android)</span>
                      <p className="text-sm text-muted-foreground">Native mobile apps with push notifications</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Browser Extension</span>
                      <p className="text-sm text-muted-foreground">Chrome/Firefox extension for on-page token analysis</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>

            {/* 2026 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-sm">Phase 6</Badge>
                <h3 className="text-xl font-semibold">Enterprise & Scaling</h3>
              </div>
              <Card className="p-6 bg-card/50">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">All Major Chains Support</span>
                      <p className="text-sm text-muted-foreground">BSC, Polygon, Arbitrum, Optimism, Avalanche coverage</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Enterprise Dashboard</span>
                      <p className="text-sm text-muted-foreground">Multi-user team accounts with role-based access</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">White-Label Solutions</span>
                      <p className="text-sm text-muted-foreground">Customizable Ward AI for exchanges and launchpads</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Predictive AI Models</span>
                      <p className="text-sm text-muted-foreground">Pre-emptive threat detection before manipulation occurs</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* API Documentation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">API Reference</h2>
          
          <div className="space-y-6">
            <Card className="p-6 bg-card/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">POST /api/analyze-token</h3>
                  <p className="text-sm text-muted-foreground">Analyze a token for security threats and risk assessment</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-background p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "address": "string" // Solana token contract address
}`}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <pre className="bg-background p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "analysis": {
    "riskScore": 45,
    "riskLevel": "medium",
    "threats": [...],
    "metrics": {
      "insiderActivity": 32.82,
      "liquidityHealth": "20/100",
      "holderConcentration": "35%",
      "tradingVolume": "$41K",
      "priceVolatility": 7.43
    },
    "recommendations": [...]
  }
}`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">GET /api/trending-tokens</h3>
                  <p className="text-sm text-muted-foreground">Fetch top 10 trending Solana tokens by volume</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <pre className="bg-background p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "tokens": [
    {
      "name": "Token Name",
      "symbol": "SYMBOL",
      "address": "...",
      "price": 0.03020,
      "volume24h": 8100000,
      "liquidity": 853000,
      "priceChange": {...},
      "age": "1mo"
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">GET /api/live-alerts</h3>
                  <p className="text-sm text-muted-foreground">Get real-time security alerts from active tokens</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Response</h4>
                  <pre className="bg-background p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "success": true,
  "alerts": [
    {
      "id": "...",
      "type": "critical" | "warning" | "info" | "success",
      "message": "...",
      "token": "...",
      "tokenAddress": "...",
      "timestamp": "..."
    }
  ]
}`}
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-border">
          <p className="text-muted-foreground">
            Built with love on Solana
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Ward AI - Protecting the decentralized future
          </p>
        </div>
      </div>
    </div>
  )
}
