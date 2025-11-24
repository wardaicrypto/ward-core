"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { AlertCircle, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface LiveTradingChartProps {
  tokenAddress: string
  symbol: string
  currentPrice: number
}

interface Alert {
  id: string
  type: "buy" | "sell" | "whale" | "price"
  message: string
  timestamp: number
  severity: "high" | "medium" | "low"
  amount?: number
  value?: number
  wallet?: string
}

interface OrderBookEntry {
  price: number
  size: number
  total: number
  percentage: number
}

export function LiveTradingChart({ tokenAddress, symbol, currentPrice }: LiveTradingChartProps) {
  const [price, setPrice] = useState(currentPrice)
  const [priceChange, setPriceChange] = useState(0)
  const [isLive, setIsLive] = useState(false)
  const [activeTab, setActiveTab] = useState<"alerts">("alerts")
  const [liveAlerts, setLiveAlerts] = useState<Alert[]>([])
  const [asks, setAsks] = useState<OrderBookEntry[]>([])
  const [bids, setBids] = useState<OrderBookEntry[]>([])
  const shownAlertTypesRef = useRef<Map<string, number>>(new Map())
  const rateLimitCountRef = useRef(0)
  const lastSuccessRef = useRef(Date.now())

  useEffect(() => {
    const fetchLiveActivity = async () => {
      if (rateLimitCountRef.current > 3) {
        const timeSinceLastSuccess = Date.now() - lastSuccessRef.current
        const backoffTime = Math.min(60000, 10000 * Math.pow(2, rateLimitCountRef.current - 3))
        if (timeSinceLastSuccess < backoffTime) {
          console.log("[v0] Skipping fetch due to rate limit backoff")
          return
        }
      }

      console.log("[v0] Fetching live trading activity for:", tokenAddress)
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)

        if (response.status === 429) {
          rateLimitCountRef.current++
          console.log("[v0] Rate limited, backoff count:", rateLimitCountRef.current)
          return
        }

        if (!response.ok) {
          console.log("[v0] API returned status:", response.status)
          return
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.log("[v0] Non-JSON response received")
          return
        }

        const data = await response.json()

        rateLimitCountRef.current = 0
        lastSuccessRef.current = Date.now()

        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0]
          const alerts: Alert[] = []

          const volume5m = Number.parseFloat(pair.volume?.m5 || "0")
          const volume1h = Number.parseFloat(pair.volume?.h1 || "0")
          const volume24h = Number.parseFloat(pair.volume?.h24 || "0")
          const currentPrice = Number.parseFloat(pair.priceUsd || "0")
          const priceChange1m = Number.parseFloat(pair.priceChange?.m1 || "0")
          const priceChange5m = Number.parseFloat(pair.priceChange?.m5 || "0")
          const priceChange15m = Number.parseFloat(pair.priceChange?.m15 || "0")
          const priceChange1h = Number.parseFloat(pair.priceChange?.h1 || "0")
          const priceChange6h = Number.parseFloat(pair.priceChange?.h6 || "0")
          const priceChange24h = Number.parseFloat(pair.priceChange?.h24 || "0")
          const marketCap = Number.parseFloat(pair.fdv || pair.marketCap || "0")
          const liquidity = Number.parseFloat(pair.liquidity?.usd || "0")
          const transactions = pair.txns || {}
          const buys1m = transactions.m1?.buys || 0
          const sells1m = transactions.m1?.sells || 0
          const buys5m = transactions.m5?.buys || 0
          const sells5m = transactions.m5?.sells || 0
          const buys1h = transactions.h1?.buys || 0
          const sells1h = transactions.h1?.sells || 0

          const isLowCap = marketCap < 100000
          const isMidCap = marketCap >= 100000 && marketCap < 1000000
          const isHighCap = marketCap >= 1000000

          const bigBuyThreshold = isLowCap ? 300 : isMidCap ? 1000 : 3000
          const multipleSellThreshold = isLowCap ? 200 : isMidCap ? 500 : 1000

          const wasRecentlyShown = (alertType: string, cooldownMs = 60000) => {
            const lastShown = shownAlertTypesRef.current.get(alertType)
            if (!lastShown) return false
            const elapsed = Date.now() - lastShown
            if (elapsed > cooldownMs) {
              shownAlertTypesRef.current.delete(alertType)
              return false
            }
            return true
          }

          const addAlert = (alertType: string, alert: Alert, cooldownMs = 60000) => {
            if (!wasRecentlyShown(alertType, cooldownMs)) {
              alerts.push(alert)
              shownAlertTypesRef.current.set(alertType, Date.now())
            }
          }

          if (volume1h > 0 && buys1m > 0) {
            const estimatedBuyVolume1m = (volume5m / 5) * (buys1m / (buys1m + sells1m + 1))
            if (estimatedBuyVolume1m > bigBuyThreshold) {
              addAlert(
                "big-buy",
                {
                  id: `big-buy-${Date.now()}-${Math.random()}`,
                  type: "whale",
                  message: `🐋 BIG BUY: $${estimatedBuyVolume1m.toLocaleString(undefined, { maximumFractionDigits: 0 })} worth in last 1min`,
                  timestamp: Date.now(),
                  severity: estimatedBuyVolume1m > bigBuyThreshold * 2 ? "high" : "medium",
                  value: estimatedBuyVolume1m,
                },
                60000,
              )
            }
          }

          if (sells1m >= 3) {
            const estimatedSellVolume1m = (volume5m / 5) * (sells1m / (buys1m + sells1m + 1))
            if (estimatedSellVolume1m > multipleSellThreshold) {
              addAlert(
                "multiple-sells",
                {
                  id: `multiple-sells-${Date.now()}-${Math.random()}`,
                  type: "sell",
                  message: `🚨 MULTIPLE SELLS: ${sells1m} sells totaling $${estimatedSellVolume1m.toLocaleString(undefined, { maximumFractionDigits: 0 })} in 1min`,
                  timestamp: Date.now(),
                  severity: "high",
                  value: estimatedSellVolume1m,
                },
                60000,
              )
            }
          }

          if (buys1m >= 5 && buys1m > sells1m * 2) {
            addAlert(
              "rapid-buying",
              {
                id: `rapid-buying-${Date.now()}-${Math.random()}`,
                type: "buy",
                message: `⚡ RAPID BUYING: ${buys1m} buys vs ${sells1m} sells in 1min`,
                timestamp: Date.now(),
                severity: "high",
              },
              60000,
            )
          }

          if (sells1m >= 5 && sells1m > buys1m * 2) {
            addAlert(
              "panic-selling",
              {
                id: `panic-selling-${Date.now()}-${Math.random()}`,
                type: "sell",
                message: `⚠️ PANIC SELLING: ${sells1m} sells vs ${buys1m} buys in 1min`,
                timestamp: Date.now(),
                severity: "high",
              },
              60000,
            )
          }

          if (buys5m > 0 && sells5m > 0 && buys1m + sells1m >= 5) {
            const buyRatio1m = buys1m / (buys1m + sells1m + 1)
            const buyRatio5m = buys5m / (buys5m + sells5m)

            if (buyRatio1m > 0.75 && buyRatio5m < 0.5) {
              addAlert(
                "momentum-shift-buy",
                {
                  id: `momentum-shift-buy-${Date.now()}-${Math.random()}`,
                  type: "buy",
                  message: `🔄 MOMENTUM SHIFT: Buyers taking control (${Math.round(buyRatio1m * 100)}% buys in 1m)`,
                  timestamp: Date.now(),
                  severity: "medium",
                },
                60000,
              )
            } else if (buyRatio1m < 0.25 && buyRatio5m > 0.5) {
              addAlert(
                "momentum-shift-sell",
                {
                  id: `momentum-shift-sell-${Date.now()}-${Math.random()}`,
                  type: "sell",
                  message: `🔄 MOMENTUM SHIFT: Sellers taking control (${Math.round((1 - buyRatio1m) * 100)}% sells in 1m)`,
                  timestamp: Date.now(),
                  severity: "medium",
                },
                60000,
              )
            }
          }

          if (Math.abs(priceChange1m) > 8) {
            const direction = priceChange1m > 0 ? "BREAKOUT" : "BREAKDOWN"
            const emoji = priceChange1m > 0 ? "🚀" : "💥"
            addAlert(
              `${direction.toLowerCase()}-1m`,
              {
                id: `${direction.toLowerCase()}-1m-${Date.now()}-${Math.random()}`,
                type: priceChange1m > 0 ? "buy" : "sell",
                message: `${emoji} ${direction} (1m): ${priceChange1m > 0 ? "+" : ""}${priceChange1m.toFixed(1)}%`,
                timestamp: Date.now(),
                severity: "high",
              },
              60000,
            )
          }

          if (Math.abs(priceChange5m) > 15) {
            const direction = priceChange5m > 0 ? "BREAKOUT" : "BREAKDOWN"
            const emoji = priceChange5m > 0 ? "🚀" : "💥"
            addAlert(
              `${direction.toLowerCase()}-5m`,
              {
                id: `${direction.toLowerCase()}-5m-${Date.now()}-${Math.random()}`,
                type: priceChange5m > 0 ? "buy" : "sell",
                message: `${emoji} ${direction} (5m): ${priceChange5m > 0 ? "+" : ""}${priceChange5m.toFixed(1)}%`,
                timestamp: Date.now(),
                severity: "high",
              },
              60000,
            )
          }

          if (priceChange1m > 3 && priceChange5m > 7 && priceChange15m > 12) {
            addAlert(
              "strong-uptrend",
              {
                id: `strong-uptrend-${Date.now()}-${Math.random()}`,
                type: "buy",
                message: `📈 STRONG UPTREND: +${priceChange1m.toFixed(1)}% (1m) | +${priceChange5m.toFixed(1)}% (5m) | +${priceChange15m.toFixed(1)}% (15m)`,
                timestamp: Date.now(),
                severity: "high",
              },
              60000,
            )
          }

          if (priceChange1m < -3 && priceChange5m < -7 && priceChange15m < -12) {
            addAlert(
              "strong-downtrend",
              {
                id: `strong-downtrend-${Date.now()}-${Math.random()}`,
                type: "sell",
                message: `📉 STRONG DOWNTREND: ${priceChange1m.toFixed(1)}% (1m) | ${priceChange5m.toFixed(1)}% (5m) | ${priceChange15m.toFixed(1)}% (15m)`,
                timestamp: Date.now(),
                severity: "high",
              },
              60000,
            )
          }

          if (volume5m > volume1h * 0.2) {
            addAlert(
              "volume-spike",
              {
                id: `volume-spike-${Date.now()}-${Math.random()}`,
                type: "whale",
                message: `📊 VOLUME SPIKE: 5m volume is ${((volume5m / (volume1h / 12)) * 100).toFixed(0)}% of avg`,
                timestamp: Date.now(),
                severity: "medium",
              },
              60000,
            )
          }

          if (liquidity > 0) {
            const liquidityRatio = volume24h / liquidity
            if (liquidityRatio > 5) {
              addAlert(
                "high-turnover",
                {
                  id: `high-turnover-${Date.now()}-${Math.random()}`,
                  type: "whale",
                  message: `💧 HIGH TURNOVER: 24h volume is ${liquidityRatio.toFixed(1)}x liquidity`,
                  timestamp: Date.now(),
                  severity: "medium",
                },
                120000,
              )
            }
          }

          if (priceChange24h < -15 && priceChange1h > 8) {
            addAlert(
              "recovery",
              {
                id: `recovery-${Date.now()}-${Math.random()}`,
                type: "buy",
                message: `🔄 RECOVERY: +${priceChange1h.toFixed(1)}% in 1h after ${priceChange24h.toFixed(1)}% 24h drop`,
                timestamp: Date.now(),
                severity: "medium",
              },
              60000,
            )
          }

          if (priceChange24h > 30 && priceChange1h < -8) {
            addAlert(
              "dump",
              {
                id: `dump-${Date.now()}-${Math.random()}`,
                type: "sell",
                message: `⚠️ DUMP: ${priceChange1h.toFixed(1)}% in 1h after +${priceChange24h.toFixed(1)}% 24h pump`,
                timestamp: Date.now(),
                severity: "high",
              },
              60000,
            )
          }

          if (alerts.length > 0) {
            console.log("[v0] Adding new alerts:", alerts.length)
            setLiveAlerts((prev) => {
              const combined = [...alerts, ...prev]
              return combined.slice(0, 20)
            })
          }
        }
      } catch (error) {
        console.error("[v0] Live activity fetch error:", error)
      }
    }

    fetchLiveActivity()
    const interval = setInterval(fetchLiveActivity, 3000)

    return () => clearInterval(interval)
  }, [tokenAddress, symbol])

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLive(true)
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)

        if (response.status === 429 || !response.ok) {
          return
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          return
        }

        const data = await response.json()

        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0]
          const currentPrice = Number.parseFloat(pair.priceUsd)
          const change24h = Number.parseFloat(pair.priceChange?.h24 || "0")

          setPrice(currentPrice)
          setPriceChange(change24h)
        }

        setIsLive(true)
      } catch (error) {
        console.error("[v0] Fetch price error:", error)
        setIsLive(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 5000)

    return () => clearInterval(interval)
  }, [tokenAddress])

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`)

        if (response.status === 429 || !response.ok) {
          return
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          return
        }

        const data = await response.json()

        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0]
          const currentPrice = Number.parseFloat(pair.priceUsd || "0")
          const liquidity = Number.parseFloat(pair.liquidity?.usd || "0")

          const spreadPercent = 0.5 // 0.5% spread
          const levels = 10

          const generateAsks: OrderBookEntry[] = []
          const generateBids: OrderBookEntry[] = []

          let askTotal = 0
          let bidTotal = 0

          for (let i = 0; i < levels; i++) {
            const priceLevel = currentPrice * (1 + ((i + 1) * spreadPercent) / 100)
            const size = ((liquidity / 20) * (Math.random() * 0.5 + 0.5)) / priceLevel
            askTotal += size * priceLevel

            generateAsks.push({
              price: priceLevel,
              size: size,
              total: askTotal,
              percentage: 0,
            })
          }

          for (let i = 0; i < levels; i++) {
            const priceLevel = currentPrice * (1 - ((i + 1) * spreadPercent) / 100)
            const size = ((liquidity / 20) * (Math.random() * 0.5 + 0.5)) / priceLevel
            bidTotal += size * priceLevel

            generateBids.push({
              price: priceLevel,
              size: size,
              total: bidTotal,
              percentage: 0,
            })
          }

          const maxTotal = Math.max(askTotal, bidTotal)
          generateAsks.forEach((ask) => {
            ask.percentage = (ask.total / maxTotal) * 100
          })
          generateBids.forEach((bid) => {
            bid.percentage = (bid.total / maxTotal) * 100
          })

          setAsks(generateAsks)
          setBids(generateBids)
        }
      } catch (error) {
        console.error("[v0] Order book fetch error:", error)
      }
    }

    fetchOrderBook()
    const interval = setInterval(fetchOrderBook, 5000)

    return () => clearInterval(interval)
  }, [tokenAddress])

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "buy":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "sell":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case "whale":
        return <Activity className="w-4 h-4 text-amber-500" />
      case "price":
        return <AlertCircle className="w-4 h-4 text-cyan-500" />
    }
  }

  const getAlertColor = (type: Alert["type"], severity?: string) => {
    if (severity === "high") {
      return "bg-amber-500/20 border-amber-500/30 ring-1 ring-amber-500/50"
    }

    switch (type) {
      case "buy":
        return "bg-green-500/10 border-green-500/20"
      case "sell":
        return "bg-red-500/10 border-red-500/20"
      case "whale":
        return "bg-amber-500/10 border-amber-500/20"
      case "price":
        return "bg-cyan-500/10 border-cyan-500/20"
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-zinc-200/10 bg-white/[0.02] backdrop-blur rounded-2xl overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-light tracking-tight tabular-nums text-white/95">
                  ${price.toFixed(price < 0.001 ? 8 : 6)}
                </span>
                <span
                  className={`text-sm font-medium px-2.5 py-1.5 rounded-full ${priceChange >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                >
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}%
                </span>
              </div>
              <div className="text-xs text-zinc-400 font-light">{symbol}/USD</div>
            </div>
            {isLive && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Live</span>
              </div>
            )}
          </div>
          <div className="rounded-xl overflow-hidden border border-zinc-800/50 bg-black/20">
            <iframe
              src={`https://dexscreener.com/solana/${tokenAddress}?embed=1&theme=dark&trades=0&info=0`}
              className="w-full h-[500px] border-0"
              title={`${symbol} Trading Chart`}
            />
          </div>
        </div>
      </Card>

      <Card className="border-zinc-200/10 bg-white/[0.02] backdrop-blur rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800/30">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-cyan-500/20 text-cyan-300 rounded-full">
              <Activity className="w-4 h-4" />
              Activity
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white/90">Trading Signals</h3>
                <span className="text-xs text-zinc-500 font-light">Live</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {liveAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-800/50 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-zinc-600 animate-pulse" />
                    </div>
                    <p className="text-sm text-zinc-500 font-light">Scanning for signals...</p>
                  </div>
                ) : (
                  liveAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur ${getAlertColor(alert.type, alert.severity)} animate-in fade-in slide-in-from-top-2 duration-300`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          alert.type === "buy"
                            ? "bg-emerald-500/10"
                            : alert.type === "sell"
                              ? "bg-rose-500/10"
                              : alert.type === "whale"
                                ? "bg-amber-500/10"
                                : "bg-cyan-500/10"
                        }`}
                      >
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 font-light leading-relaxed">{alert.message}</p>
                        <p className="text-xs text-zinc-500 mt-2 font-light">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white/90">Order Book</h3>
                <span className="text-xs text-zinc-500 font-light">USDT</span>
              </div>

              <div className="rounded-xl border border-zinc-800/30 bg-zinc-900/20 overflow-hidden backdrop-blur">
                <div className="grid grid-cols-3 gap-3 px-4 py-3 bg-zinc-900/40 text-xs font-medium text-zinc-400">
                  <div className="text-left">Price</div>
                  <div className="text-right">Amount</div>
                  <div className="text-right">Total</div>
                </div>

                <div className="max-h-[170px] overflow-y-auto">
                  {asks
                    .slice()
                    .reverse()
                    .map((ask, idx) => (
                      <div
                        key={`ask-${idx}`}
                        className="grid grid-cols-3 gap-3 px-4 py-2 text-xs relative hover:bg-rose-500/5 transition-colors"
                      >
                        <div
                          className="absolute inset-0 bg-rose-500/5"
                          style={{ width: `${ask.percentage}%`, right: 0, left: "auto" }}
                        />
                        <div className="text-rose-400 relative z-10 tabular-nums font-light">
                          {ask.price.toFixed(ask.price < 0.001 ? 8 : 6)}
                        </div>
                        <div className="text-zinc-300 text-right relative z-10 tabular-nums font-light">
                          {ask.size.toFixed(2)}
                        </div>
                        <div className="text-zinc-400 text-right relative z-10 tabular-nums font-light">
                          {ask.total.toFixed(2)}
                        </div>
                      </div>
                    ))}
                </div>

                <div className="px-4 py-3 bg-zinc-900/40 border-y border-zinc-800/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/90 tabular-nums">
                      ${price.toFixed(price < 0.001 ? 8 : 6)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${priceChange >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                    >
                      {priceChange >= 0 ? "↗" : "↘"} {Math.abs(priceChange).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="max-h-[170px] overflow-y-auto">
                  {bids.map((bid, idx) => (
                    <div
                      key={`bid-${idx}`}
                      className="grid grid-cols-3 gap-3 px-4 py-2 text-xs relative hover:bg-emerald-500/5 transition-colors"
                    >
                      <div
                        className="absolute inset-0 bg-emerald-500/5"
                        style={{ width: `${bid.percentage}%`, right: 0, left: "auto" }}
                      />
                      <div className="text-emerald-400 relative z-10 tabular-nums font-light">
                        {bid.price.toFixed(bid.price < 0.001 ? 8 : 6)}
                      </div>
                      <div className="text-zinc-300 text-right relative z-10 tabular-nums font-light">
                        {bid.size.toFixed(2)}
                      </div>
                      <div className="text-zinc-400 text-right relative z-10 tabular-nums font-light">
                        {bid.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
