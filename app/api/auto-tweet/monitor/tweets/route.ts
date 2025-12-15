export const dynamic = "force-dynamic"

import { getTweets } from "@/lib/tweet-store"

export async function GET() {
  return Response.json({
    success: true,
    tweets: getTweets(),
  })
}
