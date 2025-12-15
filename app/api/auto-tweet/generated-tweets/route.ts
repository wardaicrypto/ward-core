export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { getTweets, tweetStore } from "@/lib/tweet-store"

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

export async function GET() {
  try {
    return Response.json({
      success: true,
      tweets: getTweets(),
    })
  } catch (error) {
    console.error("[v0] Error fetching generated tweets:", error)
    return Response.json(
      {
        success: false,
        error: String(error),
        tweets: [],
      },
      { status: 200 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const tweet = await request.json()

    tweetStore.push({
      ...tweet,
      id: `tweet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    })

    // Keep only last 50 tweets
    if (tweetStore.length > 50) {
      tweetStore.shift()
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 })
  }
}
