export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface TopToken {
  address: string
  name: string
  symbol: string
  volume24h: number
  rank: number
}

// Store last top 10 in memory (in production, use a database)
let lastTop10: TopToken[] = []

export async function GET() {
  try {
    // Fetch current trending tokens
    const trendingResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/trending-tokens`,
    )
    const trendingData = await trendingResponse.json()

    const currentTop10: TopToken[] = trendingData.pairs.slice(0, 10).map((token: any, index: number) => ({
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      volume24h: token.volume24h,
      rank: index + 1,
    }))

    // Find new entries (tokens not in previous top 10)
    const newEntries = currentTop10.filter((current) => !lastTop10.some((prev) => prev.address === current.address))

    console.log("[v0] Monitoring top 10 tokens")
    console.log("[v0] Current top 10:", currentTop10.map((t) => `${t.rank}. ${t.symbol}`).join(", "))
    console.log("[v0] New entries detected:", newEntries.length)

    // Process new entries
    const tweets = []
    for (const token of newEntries) {
      console.log(`[v0] New token entered top 10: ${token.symbol} at rank #${token.rank}`)

      try {
        // Analyze the token
        const auditResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/contract-audit?address=${token.address}`,
        )
        const analysis = await auditResponse.json()

        // Generate tweet content
        const tweetContent = generateTweetContent(token, analysis)

        // Post to Twitter
        const tweetResult = await postToTwitter(tweetContent)

        tweets.push({
          token: token.symbol,
          rank: token.rank,
          tweeted: tweetResult.success,
          tweetId: tweetResult.tweetId,
        })

        console.log(`[v0] Tweet posted for ${token.symbol}:`, tweetResult)
      } catch (error) {
        console.error(`[v0] Error processing ${token.symbol}:`, error)
        tweets.push({
          token: token.symbol,
          rank: token.rank,
          tweeted: false,
          error: String(error),
        })
      }
    }

    // Update last top 10
    lastTop10 = currentTop10

    return Response.json({
      success: true,
      currentTop10: currentTop10.map((t) => ({ symbol: t.symbol, rank: t.rank })),
      newEntries: newEntries.length,
      tweets,
    })
  } catch (error) {
    console.error("[v0] Auto-tweet monitor error:", error)
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}

function generateTweetContent(token: TopToken, analysis: any): string {
  const emoji = analysis.overallScore >= 70 ? "🟢" : analysis.overallScore >= 50 ? "🟡" : "🔴"
  const bundleStatus = analysis.verification?.bundleDetection?.detected ? "⚠️ Bundles Detected" : "✅ Clean"
  const sniperStatus = analysis.verification?.sniperActivity?.detected ? "🎯 Snipers Active" : "✅ No Snipers"

  const volume = (token.volume24h / 1000000).toFixed(2)
  const liquidity = (analysis.tokenInfo?.liquidity / 1000).toFixed(0)

  return `${emoji} NEW in Top 10: $${token.symbol} #${token.rank}

📊 Ward AI Analysis:
• Risk Score: ${analysis.overallScore}/100
• ${bundleStatus}
• ${sniperStatus}
• Volume: $${volume}M
• Liquidity: $${liquidity}K

🔍 Analyze: https://ward-ai.com/analyze?token=${token.address}

#Solana #Crypto #WardAI`
}

async function postToTwitter(content: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  try {
    const TWITTER_API_KEY = process.env.TWITTER_API_KEY
    const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET
    const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN
    const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET

    if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
      console.log("[v0] Twitter credentials not configured, skipping tweet")
      return {
        success: false,
        error: "Twitter credentials not configured",
      }
    }

    const { OAuth } = await import("oauth")

    const oauthClient = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      TWITTER_API_KEY,
      TWITTER_API_SECRET,
      "1.0A",
      null,
      "HMAC-SHA1",
    )

    return new Promise((resolve) => {
      oauthClient.post(
        "https://api.twitter.com/2/tweets",
        TWITTER_ACCESS_TOKEN,
        TWITTER_ACCESS_SECRET,
        { text: content },
        "application/json",
        (error: any, data: any) => {
          if (error) {
            console.error("[v0] Twitter API error:", error)
            resolve({ success: false, error: String(error) })
          } else {
            const response = JSON.parse(data)
            console.log("[v0] Tweet posted successfully:", response.data.id)
            resolve({ success: true, tweetId: response.data.id })
          }
        },
      )
    })
  } catch (error) {
    console.error("[v0] Twitter post error:", error)
    return { success: false, error: String(error) }
  }
}
