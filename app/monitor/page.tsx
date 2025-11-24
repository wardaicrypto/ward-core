import { MarketGuardHeader } from '@/components/market-guard-header'
import { TrendingTokens } from '@/components/trending-tokens'
import { LiveAlertFeed } from '@/components/live-alert-feed'
import { TokenWatchlist } from '@/components/token-watchlist'

export const dynamic = 'force-dynamic'

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketGuardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Real-Time Monitor</h1>
          <p className="text-muted-foreground">
            Track trending tokens, manage your watchlist, and monitor live security alerts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TokenWatchlist />
          </div>
          
          <div className="lg:col-span-1">
            <LiveAlertFeed />
          </div>
        </div>

        <TrendingTokens />
      </main>
    </div>
  )
}
