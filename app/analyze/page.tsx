import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { TokenAnalyzer } from '@/components/token-analyzer'

interface TokenAnalysis {
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  threats: Array<{
    type: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    confidence: number
  }>
  metrics: {
    insiderActivity: number
    liquidityHealth: number
    holderConcentration: number
    tradingVolume: number
    priceVolatility: number
  }
  recommendations: string[]
}

interface TokenData {
  name: string
  symbol: string
  address: string
  priceUsd: string
  volume24h: number
  priceChange24h: number
  liquidity: number
  marketCap: number
}

interface PageProps {
  searchParams: Promise<{ token?: string }>
}

function AnalyzerLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default async function AnalyzePage({ searchParams }: PageProps) {
  const params = await searchParams
  const tokenAddress = params.token || null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <TokenAnalyzer tokenAddress={tokenAddress} />
      </main>
    </div>
  )
}
