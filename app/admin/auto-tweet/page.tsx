import { AutoTweetDashboard } from "@/components/auto-tweet-dashboard"

export default function AutoTweetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Auto-Tweet System</h1>
        <p className="text-gray-400 mb-8">
          Automatically tweet Ward AI analysis when new tokens enter the top 10 by volume
        </p>
        <AutoTweetDashboard />
      </div>
    </div>
  )
}
