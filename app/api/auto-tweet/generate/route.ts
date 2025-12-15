export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { addTweet } from "@/lib/tweet-store"

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const address = url.searchParams.get("address")
    const symbol = url.searchParams.get("symbol")
    const rank = url.searchParams.get("rank")

    if (!address || !symbol || !rank) {
      return Response.json({ success: false, error: "Missing address, symbol, or rank parameter" }, { status: 200 })
    }

    console.log(`[v0] Generating tweet for ${symbol} (${address}) at rank #${rank}`)

    // Analyze the token using contract audit API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
    const auditUrl = `${cleanBaseUrl}/api/contract-audit?address=${address}`

    console.log(`[v0] Fetching analysis from: ${auditUrl}`)

    const auditResponse = await fetch(auditUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(30000),
      redirect: "error",
    })

    if (!auditResponse.ok) {
      throw new Error(`Audit API returned ${auditResponse.status}`)
    }

    const contentType = auditResponse.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await auditResponse.text()
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`)
    }

    const analysis = await auditResponse.json()
    console.log(`[v0] Analysis complete - Score: ${analysis.overallScore}`)

    // Generate tweet content
    const emoji = analysis.overallScore >= 70 ? "🟢" : analysis.overallScore >= 50 ? "🟡" : "🔴"
    const bundleStatus = analysis.verification?.bundleDetection?.detected ? "⚠️ Bundles Detected" : "✅ Clean"
    const sniperStatus = analysis.verification?.sniperActivity?.detected ? "🎯 Snipers Active" : "✅ No Snipers"

    const liquidity = ((analysis.tokenInfo?.liquidity || 0) / 1000).toFixed(0)

    const tweetContent = `${emoji} Top #${rank}: $${symbol} 

📊 Ward AI Analysis:
• Risk Score: ${analysis.overallScore}/100
• ${bundleStatus}
• ${sniperStatus}
• Liquidity: $${liquidity}K

🔍 Analyze: ${cleanBaseUrl}/analyze?token=${address}

#Solana #Crypto #WardAI`

    const tweetObject = {
      content: tweetContent,
      token: {
        symbol: symbol,
        address: address,
        rank: Number.parseInt(rank),
      },
      analysis: {
        riskScore: analysis.overallScore,
        bundleDetected: analysis.verification?.bundleDetection?.detected || false,
        sniperDetected: analysis.verification?.sniperActivity?.detected || false,
      },
      posted: false,
    }

    addTweet(tweetObject)

    console.log(`[v0] Tweet generated for ${symbol}, stored in memory`)

    return Response.json({
      success: true,
      tweet: {
        ...tweetObject,
        id: `${address}-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Error generating tweet:", error)
    return Response.json(
      {
        success: false,
        error: String(error),
      },
      { status: 200 },
    )
  }
}
