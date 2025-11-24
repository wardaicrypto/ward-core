"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, MessageCircle, Activity, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { SentimentGauge } from "./sentiment-gauge"

interface SentimentData {
  tokenSymbol: string
  overallSentiment: number // -100 to 100
  twitterMentions: number
  positivePercentage: number
  negativePercentage: number
  neutralPercentage: number
  trendingScore: number
  socialPosts?: Array<{
    platform: string
    user: string
    content: string
    timestamp: number
    engagement: number
    sentiment: string
    url: string
    likes?: number
    retweets?: number
    comments?: number
  }> | null
  realTimeData: {
    buys: number
    sells: number
    priceChange24h: number
    volume24h: number
    buyRatio: string
    hasRealTwitterData?: boolean
    twitterMentions?: number
    twitterFollowers?: number
    redditSubscribers?: number
    publicInterest?: number
    communityScore?: number
    hasRealSocialData?: boolean
    source?: string
  }
  mlRiskData?: {
    overallRisk: number
    rugPullProbability: number
    manipulationScore: number
    recommendation: string
  }
}

interface SentimentTrackerProps {
  tokenAddress?: string
  tokenSymbol?: string
}

export function SentimentTracker({
  tokenAddress: propTokenAddress,
  tokenSymbol: propTokenSymbol,
}: SentimentTrackerProps = {}) {
  const [tokenSymbol, setTokenSymbol] = useState(propTokenSymbol || "")
  const [loading, setLoading] = useState(false)
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    if (propTokenSymbol) {
      setTokenSymbol(propTokenSymbol)
      fetchSentiment(propTokenSymbol)
      setAutoRefresh(true)
    }
  }, [propTokenSymbol])

  const fetchSentiment = async (symbol: string) => {
    setLoading(true)
    try {
      const [sentimentResponse, mlRiskResponse] = await Promise.all([
        fetch(`/api/social-sentiment?symbol=${symbol}&address=${propTokenAddress || ""}&t=${Date.now()}`),
        propTokenAddress
          ? fetch(`/api/ml-risk-analysis?address=${propTokenAddress}&t=${Date.now()}`)
          : Promise.resolve(null),
      ])

      if (!sentimentResponse.ok) {
        throw new Error("Failed to fetch sentiment")
      }

      const data = await sentimentResponse.json()

      let mlRiskData = undefined
      if (mlRiskResponse && mlRiskResponse.ok) {
        mlRiskData = await mlRiskResponse.json()
      }

      setSentimentData({
        tokenSymbol: data.tokenSymbol,
        overallSentiment: data.overallSentiment,
        twitterMentions: data.twitterMentions,
        positivePercentage: data.positivePercentage,
        negativePercentage: data.negativePercentage,
        neutralPercentage: data.neutralPercentage,
        trendingScore: data.trendingScore,
        socialPosts: data.socialPosts,
        realTimeData: data.realTimeData,
        mlRiskData,
      })
    } catch (error) {
      console.error("[v0] Sentiment fetch error:", error)
      alert("Failed to fetch sentiment data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const analyzeSentiment = () => {
    if (tokenSymbol) {
      fetchSentiment(tokenSymbol)
      setAutoRefresh(true)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh && tokenSymbol) {
      const interval = setInterval(() => {
        fetchSentiment(tokenSymbol)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh, tokenSymbol])

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 30) return "text-green-500"
    if (sentiment > -30) return "text-yellow-500"
    return "text-red-500"
  }

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment > 30) return <Badge className="bg-green-500 text-white">Bullish</Badge>
    if (sentiment > -30) return <Badge className="bg-yellow-500 text-white">Neutral</Badge>
    return <Badge className="bg-red-500 text-white">Bearish</Badge>
  }

  const getSentimentEmoji = (sentiment: "positive" | "negative" | "neutral") => {
    switch (sentiment) {
      case "positive":
        return "📈"
      case "negative":
        return "📉"
      case "neutral":
        return "➡️"
    }
  }

  const getPlatformIcon = (platform: "twitter" | "reddit") => {
    return platform === "twitter" ? "𝕏" : "🔴"
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = Date.now()
    const diff = now - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (hours > 24) return `${Math.floor(hours / 24)}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "positive") return "🟢"
    if (sentiment === "negative") return "🔴"
    return "🟡"
  }

  return (
    <div className="space-y-6">
      {!propTokenSymbol && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <CardTitle>Social Sentiment Analysis</CardTitle>
                <CardDescription>
                  Track community sentiment on social metrics with AI-powered analysis to detect pump schemes and gauge
                  market mood.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter token symbol (e.g., WOJAK, SOL)..."
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={analyzeSentiment} disabled={!tokenSymbol || loading}>
                <Activity className="h-4 w-4 mr-2" />
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {propTokenSymbol && loading && !sentimentData && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-3">
            <Activity className="h-8 w-8 animate-spin mx-auto text-purple-500" />
            <p className="text-sm font-medium">Analyzing sentiment for ${propTokenSymbol}...</p>
            <p className="text-xs text-muted-foreground">Analyzing market data and community sentiment</p>
          </div>
        </div>
      )}

      {sentimentData && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Community Sentiment for ${sentimentData.tokenSymbol}</CardTitle>
                  <CardDescription>
                    {sentimentData.mlRiskData
                      ? `AI-powered analysis combining ${sentimentData.twitterMentions.toLocaleString()} social signals with ML risk scoring`
                      : `Based on ${sentimentData.twitterMentions.toLocaleString()} social signals and market data`}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchSentiment(tokenSymbol)} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <SentimentGauge
                    score={sentimentData.overallSentiment}
                    mlRiskScore={sentimentData.mlRiskData?.overallRisk}
                    size="lg"
                  />
                </div>

                <div className="space-y-4">
                  {sentimentData.mlRiskData && (
                    <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-2">ML Risk-Adjusted Sentiment</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {sentimentData.mlRiskData.overallRisk < 30
                            ? "🟢 Low Risk - Bullish Sentiment"
                            : sentimentData.mlRiskData.overallRisk < 60
                              ? "🟡 Moderate Risk - Neutral Sentiment"
                              : "🔴 High Risk - Bearish Sentiment"}
                        </span>
                        <span className="text-xs font-mono">Risk: {sentimentData.mlRiskData.overallRisk}/100</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Sentiment Distribution</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-500 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            Bullish
                          </span>
                          <span className="font-medium">{sentimentData.positivePercentage}%</span>
                        </div>
                        <Progress value={sentimentData.positivePercentage} className="h-2 bg-green-500/20" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Neutral</span>
                          <span className="font-medium">{sentimentData.neutralPercentage}%</span>
                        </div>
                        <Progress value={sentimentData.neutralPercentage} className="h-2 bg-yellow-500/20" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-red-500 flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            Bearish
                          </span>
                          <span className="font-medium">{sentimentData.negativePercentage}%</span>
                        </div>
                        <Progress value={sentimentData.negativePercentage} className="h-2 bg-red-500/20" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Data Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600">
                        X (Twitter)
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600">
                        Reddit
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-600">
                        On-Chain Data
                      </Badge>
                      {sentimentData.mlRiskData && (
                        <Badge variant="secondary" className="text-xs bg-pink-500/10 text-pink-600">
                          ML Risk Analysis
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                        Market Metrics
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
