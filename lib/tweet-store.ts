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

export const tweetStore: GeneratedTweet[] = []

export function addTweet(tweet: Omit<GeneratedTweet, "id" | "createdAt">) {
  tweetStore.push({
    ...tweet,
    id: `tweet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  })

  // Keep only last 50 tweets
  if (tweetStore.length > 50) {
    tweetStore.shift()
  }
}

export function getTweets() {
  return tweetStore.slice(0, 50).reverse()
}
