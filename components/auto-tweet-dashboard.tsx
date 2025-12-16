"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Twitter, Check, X, Send, Copy } from "lucide-react"

interface MonitorStatus {
  currentTop10: Array<{
    symbol: string
    rank: number
    address: string
    volume24h: number
    priceChange24h: number
  }>
}

interface GeneratedTweet {
  id: string
  content: string
  token: {
    symbol: string
    address: string
    rank: number
  }
  analysis: {
    riskScore: number
    bundleDetected: boolean
    sniperDetected: boolean
  }
  createdAt: string
  posted: boolean
  tweetId?: string
  error?: string
}

export function AutoTweetDashboard() {
  const [status, setStatus] = useState<MonitorStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [testTweeting, setTestTweeting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tweetUrl?: string } | null>(null)
  const [generatedTweets, setGeneratedTweets] = useState<GeneratedTweet[]>([])
  const [loadingTweets, setLoadingTweets] = useState(false)
  const [generatingTweet, setGeneratingTweet] = useState<string | null>(null)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auto-tweet/monitor")

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Non-JSON response from monitor:", text)
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`)
      }

      const data = await response.json()
      console.log("[v0] Monitor status:", data)
      setStatus(data)
    } catch (error) {
      console.error("[v0] Failed to fetch auto-tweet status:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGeneratedTweets = async () => {
    setLoadingTweets(true)
    try {
      const response = await fetch("/api/auto-tweet/generated-tweets")

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("[v0] Non-JSON response from generated-tweets:", text)
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`)
      }

      const data = await response.json()
      console.log("[v0] Generated tweets:", data)
      if (data.success) {
        setGeneratedTweets(data.tweets)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch generated tweets:", error)
    } finally {
      setLoadingTweets(false)
    }
  }

  const sendTestTweet = async () => {
    setTestTweeting(true)
    setTestResult(null)
    try {
      const response = await fetch("/api/auto-tweet/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
      const data = await response.json()
      console.log("[v0] Test tweet result:", data)
      setTestResult(data)
    } catch (error) {
      console.error("[v0] Test tweet failed:", error)
      setTestResult({
        success: false,
        message: String(error),
      })
    } finally {
      setTestTweeting(false)
    }
  }

  const copyTweetToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    alert("Tweet copied to clipboard! You can now post it manually on Twitter.")
  }

  const postTweet = async (tweetId: string, content: string) => {
    try {
      const response = await fetch("/api/auto-tweet/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const result = await response.json()

      if (result.success) {
        alert("Tweet posted successfully!")
        fetchGeneratedTweets()
      } else {
        alert(`Failed to post: ${result.message}`)
      }
    } catch (error) {
      alert(`Error posting tweet: ${error}`)
    }
  }

  const generateTweetForToken = async (tokenAddress: string, tokenSymbol: string, tokenRank: number) => {
    setGeneratingTweet(tokenSymbol)
    try {
      const response = await fetch(
        `/api/auto-tweet/generate?address=${tokenAddress}&symbol=${tokenSymbol}&rank=${tokenRank}`,
        {
          method: "POST",
        },
      )

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`)
      }

      const data = await response.json()

      if (data.success) {
        alert(`Tweet generated for ${tokenSymbol}! Check the "Generated Tweets" section below.`)
        fetchGeneratedTweets()
      } else {
        alert(`Failed to generate tweet: ${data.error}`)
      }
    } catch (error) {
      console.error(`[v0] Failed to generate tweet for ${tokenSymbol}:`, error)
      alert(`Error: ${error}`)
    } finally {
      setGeneratingTweet(null)
    }
  }

  useEffect(() => {
    fetchStatus()
    fetchGeneratedTweets()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchStatus()
        fetchGeneratedTweets()
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 backdrop-blur-sm border-yellow-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Send className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-bold">Test Twitter Integration</h2>
          </div>
          <Button
            onClick={sendTestTweet}
            disabled={testTweeting}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {testTweeting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Twitter className="h-4 w-4 mr-2" />
                Send Test Tweet
              </>
            )}
          </Button>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded border ${
              testResult.success
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              <span className="font-semibold">{testResult.success ? "Success!" : "Failed"}</span>
            </div>
            <p className="text-sm">{testResult.message}</p>
            {testResult.tweetUrl && (
              <a
                href={testResult.tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-yellow-500 hover:underline mt-2 inline-block"
              >
                View Tweet on Twitter →
              </a>
            )}
          </div>
        )}

        <p className="text-sm text-gray-400 mt-4">
          Click the button above to test if your Twitter credentials are working correctly. This will post a test tweet
          to your connected Twitter account.
        </p>
      </Card>

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
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                Current Top 10 by Volume - Click to Generate Tweet
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {status.currentTop10.map((token) => (
                  <div
                    key={token.address}
                    className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">${token.symbol}</span>
                      <span className="text-xs text-gray-500">
                        {token.priceChange24h > 0 ? "+" : ""}
                        {token.priceChange24h.toFixed(2)}%
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => generateTweetForToken(token.address, token.symbol, token.rank)}
                      disabled={generatingTweet === token.symbol}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      {generatingTweet === token.symbol ? (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Twitter className="h-3 w-3 mr-1" />
                          Tweet
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {status.currentTop10.length === 0 && (
              <div className="text-center py-8 text-gray-500">Loading top 10 tokens...</div>
            )}
          </div>
        )}
      </Card>

      {generatedTweets.length > 0 && (
        <Card className="p-6 bg-black/40 backdrop-blur-sm border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Twitter className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold">Generated Tweets</h2>
              <span className="text-sm text-gray-500">({generatedTweets.length} ready)</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchGeneratedTweets} disabled={loadingTweets}>
              <RefreshCw className={`h-4 w-4 ${loadingTweets ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="space-y-4">
            {generatedTweets.map((tweet) => (
              <div key={tweet.id} className="bg-black/40 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-yellow-500 font-semibold">${tweet.token.symbol}</span>
                      {tweet.posted ? (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">Posted</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                          Ready to Post
                        </span>
                      )}
                    </div>

                    <div className="bg-black/60 border border-gray-800 rounded p-3 mb-3">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{tweet.content}</pre>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Score: {tweet.analysis.riskScore}/100</span>
                      <span>{tweet.analysis.bundleDetected ? "⚠️ Bundles" : "✅ Clean"}</span>
                      <span>{tweet.analysis.sniperDetected ? "🎯 Snipers" : "✅ No Snipers"}</span>
                      <span>{new Date(tweet.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {tweet.posted && tweet.tweetId ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://twitter.com/i/web/status/${tweet.tweetId}`, "_blank")}
                      >
                        <Twitter className="h-4 w-4 mr-1" />
                        View Tweet
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-black"
                          onClick={() => postTweet(tweet.id, tweet.content)}
                        >
                          <Twitter className="h-4 w-4 mr-1" />
                          Post Tweet
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => copyTweetToClipboard(tweet.content)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {tweet.error && (
                  <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-xs text-orange-400">
                    {tweet.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

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
