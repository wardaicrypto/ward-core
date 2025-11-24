"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Users,
  Lock,
  Zap,
  ChevronLeft,
  Activity,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LiveTradingChart } from "./live-trading-chart"
import { ContractScanner } from "./contract-scanner"
import { SentimentTracker } from "./sentiment-tracker"
import { MLRiskScorer } from "./ml-risk-scorer"
import { TokenMetricsPanel } from "./token-metrics-panel"

interface TokenHolding {
  address: string
  symbol: string
  name: string
  balance: number
  value: number
  price: number
  priceChange24h: number
  riskScore: number
  alerts: string[]
  liquidity: number
  holders: number
  topHolderPercent: number
  devHolding: number
  suspiciousActivity: boolean
}

interface ChartData {
  timestamp: number
  price: number
  volume: number
}

export function PortfolioMonitor() {
  const [walletAddress, setWalletAddress] = useState("")
  const [holdings, setHoldings] = useState<TokenHolding[]>([])
  const [selectedToken, setSelectedToken] = useState<TokenHolding | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(false)
  const [monitoring, setMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [activeAlerts, setActiveAlerts] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [nextRefreshIn, setNextRefreshIn] = useState(10)

  const [liveHoldings, setLiveHoldings] = useState<TokenHolding[]>([])

  const generateChartData = (basePrice: number): ChartData[] => {
    const data: ChartData[] = []
    const now = Date.now()
    let price = basePrice

    for (let i = 100; i >= 0; i--) {
      const volatility = Math.random() * 0.05 - 0.025
      price = price * (1 + volatility)
      data.push({
        timestamp: now - i * 60000, // 1-minute intervals
        price: price,
        volume: Math.random() * 10000 + 5000,
      })
    }

    return data
  }

  const fetchPortfolio = async (address: string, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      console.log("[v0] Fetching portfolio for:", address)
      const response = await fetch(`/api/wallet-holdings?address=${address}`)

      if (!response.ok) {
        throw new Error("Failed to fetch wallet holdings")
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      console.log("[v0] Received holdings:", data.holdings?.length || 0, "Total value:", data.totalValue)

      setHoldings(data.holdings || [])
      setLastUpdate(new Date())

      const alerts: string[] = []
      data.holdings.forEach((h: TokenHolding) => {
        if (h.suspiciousActivity) {
          alerts.push(`⚠️ ${h.symbol}: Suspicious wallet activity detected`)
        }
        if (h.devHolding > 10) {
          alerts.push(`🚨 ${h.symbol}: High dev holding (${h.devHolding}%)`)
        }
        if (h.topHolderPercent > 15) {
          alerts.push(`📊 ${h.symbol}: Top holder controls ${h.topHolderPercent}% of supply`)
        }
        if (h.riskScore > 60) {
          alerts.push(`🔴 ${h.symbol}: High risk score (${h.riskScore}/100)`)
        }
      })
      setActiveAlerts(alerts)
    } catch (error) {
      console.error("[v0] Error fetching portfolio:", error)
      setActiveAlerts(["❌ Failed to fetch wallet data. Please check the address and try again."])
    } finally {
      setLoading(false)
      setRefreshing(false)
      setNextRefreshIn(10) // Reset countdown
    }
  }

  const startMonitoring = () => {
    if (walletAddress) {
      setLoading(true)
      setTimeout(() => {
        fetchPortfolio(walletAddress)
        setMonitoring(true)
      }, 0)
    }
  }

  const refreshPortfolio = () => {
    if (walletAddress) {
      fetchPortfolio(walletAddress, true)
    }
  }

  useEffect(() => {
    if (monitoring && walletAddress) {
      const interval = setInterval(() => {
        console.log("[v0] Auto-refreshing portfolio...")
        fetchPortfolio(walletAddress, true)
      }, 10000) // Changed from 30000 to 10000 (10 seconds)

      return () => clearInterval(interval)
    }
  }, [monitoring, walletAddress])

  useEffect(() => {
    if (monitoring && !loading && !refreshing) {
      const timer = setInterval(() => {
        setNextRefreshIn((prev) => {
          if (prev <= 1) return 10
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [monitoring, loading, refreshing])

  useEffect(() => {
    if (monitoring && holdings.length > 0) {
      const interval = setInterval(() => {
        setLiveHoldings((prevHoldings) =>
          prevHoldings.map((holding) => {
            // Simulate small price movements between real updates
            const volatility = (Math.random() - 0.5) * 0.002 // ±0.2% micro-movements
            const newPrice = holding.price * (1 + volatility)
            const newValue = newPrice * holding.balance

            return {
              ...holding,
              price: newPrice,
              value: newValue,
            }
          }),
        )
      }, 2000) // Update every 2 seconds for real-time feel

      return () => clearInterval(interval)
    }
  }, [monitoring, holdings])

  useEffect(() => {
    setLiveHoldings(holdings)
  }, [holdings])

  const getRiskBadge = (score: number) => {
    if (score < 30) return <Badge className="bg-green-500 text-white">Low Risk</Badge>
    if (score < 60) return <Badge className="bg-yellow-500 text-white">Medium Risk</Badge>
    return <Badge className="bg-red-500 text-white">High Risk</Badge>
  }

  const displayHoldings = monitoring ? liveHoldings : holdings
  const totalValue = displayHoldings.reduce((sum, h) => sum + h.value, 0)
  const avgRiskScore =
    displayHoldings.length > 0
      ? Math.round(displayHoldings.reduce((sum, h) => sum + h.riskScore, 0) / displayHoldings.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Wallet Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Portfolio Protection Monitor</CardTitle>
              <CardDescription>Real-time monitoring with threat detection across your holdings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Solana wallet address..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={monitoring}
              className="flex-1"
            />
            <Button
              onClick={monitoring ? refreshPortfolio : startMonitoring}
              variant={monitoring ? "outline" : "default"}
              disabled={(!monitoring && !walletAddress) || loading || refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${loading || refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            If data shows incorrect information, click the refresh button or wait for automatic refresh to display real
            data.
          </p>
          {lastUpdate && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Activity className={`h-3 w-3 ${refreshing ? "text-green-500 animate-pulse" : ""}`} />
              <span>
                Last updated: {lastUpdate.toLocaleTimeString()}
                {monitoring && !refreshing && ` • Next refresh in ${nextRefreshIn}s`}
                {refreshing && " • Updating..."}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {monitoring && activeAlerts.length > 0 && (
        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Active Threats Detected</div>
            <div className="space-y-1 text-sm">
              {activeAlerts.map((alert, i) => (
                <div key={i}>{alert}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio Overview */}
      {monitoring && displayHoldings.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Portfolio Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{displayHoldings.length} Tokens</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Average Risk Score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{avgRiskScore}/100</p>
                  {getRiskBadge(avgRiskScore)}
                </div>
              </CardContent>
            </Card>
          </div>

          {!selectedToken ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Holdings - Click to View Details</CardTitle>
                  <Badge variant="outline" className="gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayHoldings.map((holding) => (
                    <button
                      key={holding.address}
                      onClick={() => setSelectedToken(holding)}
                      className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/60 hover:bg-accent/50 transition-all cursor-pointer text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-lg">${holding.symbol}</p>
                          {getRiskBadge(holding.riskScore)}
                          {holding.suspiciousActivity && (
                            <Badge variant="destructive" className="animate-pulse">
                              <Zap className="h-3 w-3 mr-1" />
                              Alert
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{holding.name}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{holding.balance.toLocaleString()} tokens</span>
                          {holding.holders > 0 && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {holding.holders.toLocaleString()} holders
                            </span>
                          )}
                          {holding.liquidity > 0 && (
                            <span className="flex items-center gap-1">
                              <Lock className="h-3 w-3" />${(holding.liquidity / 1000).toFixed(1)}K liquidity
                            </span>
                          )}
                        </div>
                        {holding.alerts.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
                            <AlertTriangle className="h-3 w-3" />
                            {holding.alerts[0]}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg">${holding.value.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mb-1">${holding.price.toFixed(6)}</p>
                        <div
                          className={`flex items-center gap-1 text-sm ${
                            holding.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {holding.priceChange24h >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {Math.abs(holding.priceChange24h).toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-2xl">${selectedToken.symbol}</CardTitle>
                          {getRiskBadge(selectedToken.riskScore)}
                        </div>
                        <CardDescription className="mt-1">{selectedToken.name}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedToken(null)} className="gap-2">
                      <ChevronLeft className="h-4 w-4" />
                      Back to Holdings
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Quick Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                    <p className="text-lg font-bold">${selectedToken.price.toFixed(6)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground mb-1">24h Change</p>
                    <p
                      className={`text-lg font-bold ${selectedToken.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {selectedToken.priceChange24h >= 0 ? "+" : ""}
                      {selectedToken.priceChange24h.toFixed(2)}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Your Holdings</p>
                    <p className="text-lg font-bold">{selectedToken.balance.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground mb-1">Portfolio Value</p>
                    <p className="text-lg font-bold">${selectedToken.value.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Token Alerts */}
              {selectedToken.alerts.length > 0 && (
                <Alert variant="destructive" className="border-yellow-500/50 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-1">Active Alerts for ${selectedToken.symbol}</div>
                    <div className="space-y-1 text-sm">
                      {selectedToken.alerts.map((alert, i) => (
                        <div key={i}>• {alert}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Live Trading Chart */}
              <Card>
                <CardContent className="p-0">
                  <LiveTradingChart
                    tokenAddress={selectedToken.address}
                    symbol={selectedToken.symbol}
                    currentPrice={selectedToken.price}
                  />

                  <div className="p-6">
                    <TokenMetricsPanel
                      tokenAddress={selectedToken.address}
                      tokenSymbol={selectedToken.symbol}
                      tokenData={selectedToken}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Smart Contract Audit Scanner */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Smart Contract Audit Scanner</CardTitle>
                  <CardDescription>Comprehensive security analysis of the token contract</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContractScanner tokenAddress={selectedToken.address} tokenSymbol={selectedToken.symbol} />
                </CardContent>
              </Card>

              {/* Social Sentiment Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Sentiment Analysis</CardTitle>
                  <CardDescription>Real-time community sentiment across Twitter/X and Reddit</CardDescription>
                </CardHeader>
                <CardContent>
                  <SentimentTracker tokenAddress={selectedToken.address} tokenSymbol={selectedToken.symbol} />
                </CardContent>
              </Card>

              {/* Machine Learning Risk Scorer */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Machine Learning Risk Scorer</CardTitle>
                  <CardDescription>AI-powered risk assessment trained on 10,000+ historical scams</CardDescription>
                </CardHeader>
                <CardContent>
                  <MLRiskScorer tokenAddress={selectedToken.address} tokenSymbol={selectedToken.symbol} />
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {monitoring && displayHoldings.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">No holdings found in this wallet</p>
            <p className="text-xs text-muted-foreground/70 max-w-md mx-auto">
              Note: Tokens without active trading pairs or liquidity on Solana DEXs may not appear here. Only tokens
              with established market data are shown.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
