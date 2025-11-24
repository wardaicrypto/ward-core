'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Token {
  address: string
  name: string
  symbol: string
  priceUsd: string
  volume24h: number
  priceChange24h: number
  priceChange1h: number
  priceChange6h: number
  priceChange5m: number
  liquidity: number
  marketCap: number
  txns24h: number
  makers: number
  age: string
  chainId: string
  dexId: string
  url: string
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`
  return `$${num.toFixed(0)}`
}

const formatPercentage = (num: number): string => {
  return num >= 0 ? `+${num.toFixed(2)}%` : `${num.toFixed(2)}%`
}

export function TrendingTokens() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/trending-tokens')
        const data = await response.json()
        
        if (data.pairs) {
          setTokens(data.pairs)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch trending tokens:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrending()
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchTrending, 120000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Trending Tokens</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Top 10 Solana tokens by volume on DexScreener
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          Live
        </Badge>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary/50 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No trending tokens found. Please try again later.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left py-3 px-2 font-medium">#</th>
                <th className="text-left py-3 px-2 font-medium">TOKEN</th>
                <th className="text-right py-3 px-2 font-medium">PRICE</th>
                <th className="text-right py-3 px-2 font-medium">AGE</th>
                <th className="text-right py-3 px-2 font-medium">TXNS</th>
                <th className="text-right py-3 px-2 font-medium">VOLUME</th>
                <th className="text-right py-3 px-2 font-medium">MAKERS</th>
                <th className="text-right py-3 px-2 font-medium">5M</th>
                <th className="text-right py-3 px-2 font-medium">1H</th>
                <th className="text-right py-3 px-2 font-medium">6H</th>
                <th className="text-right py-3 px-2 font-medium">24H</th>
                <th className="text-right py-3 px-2 font-medium">LIQUIDITY</th>
                <th className="text-right py-3 px-2 font-medium">MCAP</th>
                <th className="text-right py-3 px-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr
                  key={token.address}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-4 px-2 text-muted-foreground text-sm">
                    #{index + 1}
                  </td>
                  
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate max-w-[150px]">
                            {token.name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {token.symbol}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-2 text-right">
                    <p className="font-mono text-sm">
                      ${parseFloat(token.priceUsd).toFixed(6)}
                    </p>
                  </td>

                  <td className="py-4 px-2 text-right text-sm text-muted-foreground">
                    {token.age}
                  </td>

                  <td className="py-4 px-2 text-right text-sm">
                    {token.txns24h.toLocaleString()}
                  </td>

                  <td className="py-4 px-2 text-right text-sm font-medium">
                    {formatNumber(token.volume24h)}
                  </td>

                  <td className="py-4 px-2 text-right text-sm">
                    {token.makers.toLocaleString()}
                  </td>

                  <td className="py-4 px-2 text-right text-sm">
                    <span className={token.priceChange5m >= 0 ? 'text-primary' : 'text-destructive'}>
                      {formatPercentage(token.priceChange5m)}
                    </span>
                  </td>

                  <td className="py-4 px-2 text-right text-sm">
                    <span className={token.priceChange1h >= 0 ? 'text-primary' : 'text-destructive'}>
                      {formatPercentage(token.priceChange1h)}
                    </span>
                  </td>

                  <td className="py-4 px-2 text-right text-sm">
                    <span className={token.priceChange6h >= 0 ? 'text-primary' : 'text-destructive'}>
                      {formatPercentage(token.priceChange6h)}
                    </span>
                  </td>

                  <td className="py-4 px-2 text-right text-sm font-medium">
                    <span className={token.priceChange24h >= 0 ? 'text-primary' : 'text-destructive'}>
                      {formatPercentage(token.priceChange24h)}
                    </span>
                  </td>

                  <td className="py-4 px-2 text-right text-sm">
                    {formatNumber(token.liquidity)}
                  </td>

                  <td className="py-4 px-2 text-right text-sm">
                    {formatNumber(token.marketCap)}
                  </td>

                  <td className="py-4 px-2 text-right">
                    <div className="flex gap-1 justify-end">
                      <Link href={`/analyze?token=${token.address}`}>
                        <Button size="sm" variant="outline" className="h-8 text-xs">
                          Analyze
                        </Button>
                      </Link>
                      <a href={token.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
