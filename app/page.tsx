import { MarketGuardHeader } from '@/components/market-guard-header'
import { TokenSearch } from '@/components/token-search'
import { SecurityModules } from '@/components/security-modules'
import { LiveAlertFeed } from '@/components/live-alert-feed'
import { ThreatDetection } from '@/components/threat-detection'
import { MarketStats } from '@/components/market-stats'
import { TrendingTokens } from '@/components/trending-tokens'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function MarketGuardPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketGuardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Ward AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl text-pretty">
              AI-powered security infrastructure protecting token launches from market manipulation, 
              insider threats, and predatory trading practices on DEX platforms.
            </p>
          </div>
          
          <TokenSearch />
        </section>

        {/* Stats Overview */}
        <MarketStats />

        <TrendingTokens />

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Security Modules & Threat Detection */}
          <div className="lg:col-span-2 space-y-6">
            <SecurityModules />
            <ThreatDetection />
          </div>

          {/* Right Column - Live Alert Feed */}
          <div className="lg:col-span-1">
            <LiveAlertFeed />
          </div>
        </div>
      </main>
      
      <section className="container mx-auto px-4 py-16 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-border p-12 text-center">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Explore Our Roadmap
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check out our comprehensive documentation to learn about upcoming features, 
              future development plans, and our vision for the future of token security.
            </p>
            <Link 
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              View Documentation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
