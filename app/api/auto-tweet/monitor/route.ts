export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface TopToken {
  address: string
  name: string
  symbol: string
  volume24h: number
  rank: number
}

interface GeneratedTweet {
  id: string
  content: string
  token: { symbol: string; address: string; rank: number }
  analysis: { riskScore: number; bundleDetected: boolean; sniperDetected: boolean }
  createdAt: string
  posted: boolean
  tweetId?: string
  error?: string
}

// Store last top 10 in memory (in production, use a database)
const lastTop10: TopToken[] = []

export async function GET() {
  try {
    console.log("[v0] Auto-tweet monitor: Fetching trending tokens from landing page API")

    // Fetch from the same endpoint as the landing page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

    const response = await fetch(`${cleanBaseUrl}/api/trending-tokens`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      console.error("[v0] Trending tokens API returned status:", response.status)
      return Response.json(
        {
          success: false,
          error: `Trending tokens API returned status ${response.status}`,
          currentTop10: [],
        },
        { status: 200 },
      )
    }

    const data = await response.json()
    console.log("[v0] Fetched trending tokens:", data.pairs?.length || 0)

    const tokens = data.pairs || []

    if (tokens.length === 0) {
      console.log("[v0] No tokens returned from trending API")
      return Response.json({
        success: true,
        currentTop10: [],
      })
    }

    // Format top 10 tokens with address for analyze links
    const currentTop10 = tokens.slice(0, 10).map((token: any, index: number) => ({
      symbol: token.symbol,
      rank: index + 1,
      address: token.address,
      volume24h: token.volume24h,
      priceChange24h: token.priceChange24h,
    }))

    console.log("[v0] Current top 10:", currentTop10.map((t: any) => `#${t.rank} ${t.symbol}`).join(", "))

    return Response.json({
      success: true,
      currentTop10,
    })
  } catch (error) {
    console.error("[v0] Auto-tweet monitor error:", error)
    return Response.json(
      {
        success: false,
        error: String(error),
        currentTop10: [],
      },
      { status: 200 },
    )
  }
}
