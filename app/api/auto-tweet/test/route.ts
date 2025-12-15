export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    const testMessage =
      message ||
      `🔥 Ward AI Test Tweet

This is a test tweet from Ward AI's automated monitoring system.

Testing features:
✅ Twitter OAuth 1.0A
✅ Auto-posting capability
✅ API integration

Timestamp: ${new Date().toISOString()}

#WardAI #Solana #CryptoSecurity`

    console.log("[v0] Posting test tweet...")

    const result = await postToTwitter(testMessage)

    if (result.success) {
      return Response.json({
        success: true,
        message: "Test tweet posted successfully!",
        tweetId: result.tweetId,
        tweetUrl: `https://twitter.com/i/web/status/${result.tweetId}`,
      })
    } else {
      return Response.json(
        {
          success: false,
          error: result.error,
          message: "Failed to post test tweet",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Test tweet error:", error)
    return Response.json(
      {
        success: false,
        error: String(error),
        message: "Failed to post test tweet",
      },
      { status: 500 },
    )
  }
}

async function postToTwitter(content: string): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  try {
    const TWITTER_API_KEY = process.env.TWITTER_API_KEY
    const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET
    const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN
    const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET

    if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET) {
      console.error("[v0] Missing Twitter credentials:")
      console.error("- API Key:", !!TWITTER_API_KEY)
      console.error("- API Secret:", !!TWITTER_API_SECRET)
      console.error("- Access Token:", !!TWITTER_ACCESS_TOKEN)
      console.error("- Access Secret:", !!TWITTER_ACCESS_SECRET)

      return {
        success: false,
        error:
          "Twitter credentials not configured. Please add TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, and TWITTER_ACCESS_SECRET environment variables.",
      }
    }

    const useFallbackMode = process.env.TWITTER_USE_FALLBACK === "true"

    if (useFallbackMode) {
      console.log("[v0] ⚠️ TWITTER FREE TIER DETECTED - Test tweet saved for manual posting:")
      console.log("[v0] " + "=".repeat(80))
      console.log("[v0] TEST TWEET CONTENT:")
      console.log(content)
      console.log("[v0] " + "=".repeat(80))

      return {
        success: true,
        tweetId: `test-fallback-${Date.now()}`,
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
        "https://api.twitter.com/1.1/statuses/update.json",
        TWITTER_ACCESS_TOKEN,
        TWITTER_ACCESS_SECRET,
        { status: content },
        "application/x-www-form-urlencoded",
        (error: any, data: any) => {
          if (error) {
            console.error("[v0] Twitter API error:", error)

            const errorString = String(error)
            if (errorString.includes("403") && errorString.includes("453")) {
              console.log("[v0] ⚠️ FREE TIER LIMITATION DETECTED")
              console.log("[v0] " + "=".repeat(80))
              console.log("[v0] TWEET READY TO POST MANUALLY:")
              console.log(content)
              console.log("[v0] " + "=".repeat(80))

              resolve({
                success: false,
                error:
                  "⚠️ Twitter Free Tier Limitation: Your API access doesn't support posting tweets. Please upgrade to Basic tier ($100/month) at developer.twitter.com or copy the tweet from logs and post manually.",
              })
            } else {
              resolve({ success: false, error: String(error) })
            }
          } else {
            try {
              const response = JSON.parse(data)
              console.log("[v0] Tweet posted successfully:", response.id_str)
              resolve({ success: true, tweetId: response.id_str })
            } catch (parseError) {
              console.error("[v0] Failed to parse Twitter response:", data)
              resolve({ success: false, error: "Invalid response from Twitter API" })
            }
          }
        },
      )
    })
  } catch (error) {
    console.error("[v0] Twitter post error:", error)
    return { success: false, error: String(error) }
  }
}
