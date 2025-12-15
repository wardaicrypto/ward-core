"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Twitter, Check, X } from "lucide-react"

interface MonitorStatus {
  currentTop10: Array<{ symbol: string; rank: number }>
  newEntries: number
  tweets: Array<{
    token: string
    rank: number
    tweeted: boolean
    tweetId?: string
    error?: string
  }>
}

export function AutoTweetDashboard() {
  const [status, setStatus] = useState<MonitorStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auto-tweet/monitor")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch auto-tweet status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchStatus, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 backdrop-blur-sm border-yellow-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Twitter className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold">Auto-Tweet Monitor</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "border-yellow-500" : ""}
            >
              {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchStatus} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {status && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Current Top 10</h3>
              <div className="grid grid-cols-5 gap-2">
                {status.currentTop10.map((token) => (
                  <div
                    key={token.symbol}
                    className="bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1 text-sm"
                  >
                    #{token.rank} {token.symbol}
                  </div>
                ))}
              </div>
            </div>

            {status.newEntries > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-green-400 mb-2">New Entries Detected: {status.newEntries}</h3>
                <div className="space-y-2">
                  {status.tweets.map((tweet, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-black/40 border border-gray-700 rounded p-3"
                    >
                      <div className="flex items-center gap-2">
                        {tweet.tweeted ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-mono">
                          #{tweet.rank} ${tweet.token}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {tweet.tweeted ? (
                          <a
                            href={`https://twitter.com/i/web/status/${tweet.tweetId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500 hover:underline"
                          >
                            View Tweet
                          </a>
                        ) : (
                          <span className="text-red-500">{tweet.error || "Failed"}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status.newEntries === 0 && (
              <div className="text-center py-8 text-gray-500">No new tokens in top 10. Monitoring...</div>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6 bg-black/40 backdrop-blur-sm border-yellow-500/20">
        <h3 className="text-lg font-bold mb-4">Setup Instructions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-yellow-500">1. Add Twitter API Credentials</p>
            <p className="text-gray-400">Go to Vercel project settings and add:</p>
            <ul className="list-disc list-inside text-gray-500 ml-4 mt-1">
              <li>TWITTER_API_KEY</li>
              <li>TWITTER_API_SECRET</li>
              <li>TWITTER_ACCESS_TOKEN</li>
              <li>TWITTER_ACCESS_SECRET</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-yellow-500">2. Set Up Cron Job</p>
            <p className="text-gray-400">
              Create a vercel.json with cron configuration to call /api/auto-tweet/webhook every 5 minutes
            </p>
          </div>
          <div>
            <p className="font-semibold text-yellow-500">3. Optional: Webhook Secret</p>
            <p className="text-gray-400">Add AUTO_TWEET_WEBHOOK_SECRET for security</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
