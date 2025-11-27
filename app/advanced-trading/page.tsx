"use client"

import { MarketGuardHeader } from "@/components/market-guard-header"
import { TokenDiscovery } from "@/components/token-discovery"
import { Footer } from "@/components/footer"
import { AlertCircle } from "lucide-react"

export default function AdvancedTradingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <MarketGuardHeader />

      <div className="bg-blue-950/30 border-b border-blue-900/30">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base text-blue-400 font-semibold mb-1">Phase 3 - Coming Soon</h3>
              <p className="text-xs sm:text-sm text-blue-300/80">
                Advanced Trading features are currently in backlog and will be released in Phase 3. The data you're
                seeing is only mock data built on our initial foundation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <TokenDiscovery />

      <Footer hideBetaBanner={true} />
    </div>
  )
}
