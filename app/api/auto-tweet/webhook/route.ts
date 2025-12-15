export const dynamic = "force-dynamic"

// This endpoint can be called by a cron job or external scheduler
export async function POST(request: Request) {
  try {
    const { authorization } = await request.headers

    // Verify webhook secret
    const webhookSecret = process.env.AUTO_TWEET_WEBHOOK_SECRET
    if (webhookSecret && authorization !== `Bearer ${webhookSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Trigger the monitoring
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const monitorResponse = await fetch(`${baseUrl}/api/auto-tweet/monitor`)
    const result = await monitorResponse.json()

    return Response.json(result)
  } catch (error) {
    console.error("[v0] Auto-tweet webhook error:", error)
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
