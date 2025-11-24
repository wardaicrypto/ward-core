'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, X, TrendingUp, TrendingDown, ExternalLink, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

const MAX_WATCHLIST_TOKENS = 5

interface WatchlistToken {
  address: string
  name: string
  symbol: string
  priceUsd: string
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  txns24h: number
  age: string
  riskScore?: number
  lastUpdated: number
}

export function TokenWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistToken[]>([])
  const [tokenAddress, setTokenAddress] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('ward-ai-watchlist')
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved))
      } catch (e) {
        console.error('[v0] Failed to parse watchlist:', e)
        localStorage.removeItem('ward-ai-watchlist')
      }
    }
  }, [])

  const saveToStorage = (tokens: WatchlistToken[]) => {
    if (tokens.length === 0) {
      localStorage.removeItem('ward-ai-watchlist')
    } else {
      localStorage.setItem('ward-ai-watchlist', JSON.stringify(tokens))
    }
  }

  const refreshTokens = async () => {
    if (watchlist.length === 0) return
    
    setIsRefreshing(true)
    setError('')
    
    try {
      const updated = await Promise.all(
        watchlist.map(async (token) => {
          try {
            const response = await fetch(`/api/analyze-token?address=${token.address}`)
            
            if (!response.ok) {
              return token // Keep existing data on error
            }

            const data = await response.json()
            
            if (data.token) {
              return {
                ...token,
                priceUsd: data.token.priceUsd,
                priceChange24h: data.token.priceChange24h,
                volume24h: data.token.volume24h,
                liquidity: data.token.liquidity,
                marketCap: data.token.marketCap,
                txns24h: data.token.txns24h,
                riskScore: data.analysis?.riskScore,
                lastUpdated: Date.now()
              }
            }
            return token
          } catch (error) {
            return token // Keep existing data on error
          }
        })
      )
      setWatchlist(updated)
      saveToStorage(updated)
    } catch (error) {
      setError('Failed to refresh tokens')
    } finally {
      setIsRefreshing(false)
    }
  }

  const removeToken = (address: string) => {
    const filtered = watchlist.filter(t => t.address !== address)
    setWatchlist(filtered)
    saveToStorage(filtered)
  }

  const addToken = async () => {
    if (!tokenAddress.trim()) return
    
    if (watchlist.length >= MAX_WATCHLIST_TOKENS) {
      setError(`Maximum ${MAX_WATCHLIST_TOKENS} tokens allowed in watchlist`)
      return
    }
    
    if (watchlist.some(t => t.address === tokenAddress.trim())) {
      setError('Token already in watchlist')
      return
    }
    
    setIsAdding(true)
    setError('')

    try {
      const response = await fetch(`/api/analyze-token?address=${tokenAddress.trim()}`)
      
      if (!response.ok) {
        setError(`Failed to fetch token data: ${response.status}`)
        return
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setError('Invalid response from server. Please try again later.')
        return
      }

      const data = await response.json()

      if (!data.token) {
        setError('Token not found. Please check the contract address.')
        return
      }

      const newToken: WatchlistToken = {
        address: data.token.address,
        name: data.token.name,
        symbol: data.token.symbol,
        priceUsd: data.token.priceUsd,
        priceChange24h: data.token.priceChange24h,
        volume24h: data.token.volume24h,
        liquidity: data.token.liquidity,
        marketCap: data.token.marketCap,
        txns24h: data.token.txns24h,
        age: data.token.age,
        riskScore: data.analysis?.riskScore,
        lastUpdated: Date.now()
      }

      const updatedList = [newToken, ...watchlist]
      setWatchlist(updatedList)
      saveToStorage(updatedList)
      setTokenAddress('')
    } catch (error) {
      console.error('[v0] Add token error:', error)
      setError('Failed to add token. Please try again.')
    } finally {
      setIsAdding(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`
    return `$${num.toFixed(0)}`
  }

  return (
    <Card className="p-6 bg-card border-border h-[600px] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold">Token Watchlist</h2>
          <div className="flex items-center gap-2">
            {watchlist.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTokens}
                disabled={isRefreshing}
                className="h-8"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            <Badge variant="outline" className="text-xs">
              {watchlist.length}/{MAX_WATCHLIST_TOKENS}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Add tokens by contract address to monitor
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Enter Solana token contract address..."
            value={tokenAddress}
            onChange={(e) => {
              setTokenAddress(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => e.key === 'Enter' && !isAdding && addToken()}
            className="flex-1"
            disabled={watchlist.length >= MAX_WATCHLIST_TOKENS}
          />
          <Button 
            onClick={addToken} 
            disabled={isAdding || !tokenAddress.trim() || watchlist.length >= MAX_WATCHLIST_TOKENS}
            className="flex-shrink-0"
          >
            {isAdding ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="break-words">{error}</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 min-h-0">
        {watchlist.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="mb-4 text-4xl">📊</div>
            <p className="text-sm">No tokens in watchlist yet</p>
            <p className="text-xs mt-1">Add up to {MAX_WATCHLIST_TOKENS} Solana token addresses to start monitoring</p>
          </div>
        ) : (
          <div className="space-y-3 pr-4">
            {watchlist.map((token) => (
              <div
                key={token.address}
                className="p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeToken(token.address)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 z-10 hover:bg-destructive/20"
                  aria-label="Remove token"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="pr-10 mb-3">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-lg truncate">{token.name}</h3>
                    <Badge variant="outline">${token.symbol}</Badge>
                    {token.riskScore !== undefined && (
                      <Badge 
                        variant={token.riskScore >= 70 ? 'destructive' : token.riskScore >= 40 ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        Risk: {token.riskScore}/100
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {token.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold">
                        ${parseFloat(token.priceUsd).toFixed(6)}
                      </p>
                      <div className={`flex items-center gap-1 text-xs ${token.priceChange24h >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {token.priceChange24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(token.priceChange24h).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
                    <p className="font-semibold">{formatNumber(token.volume24h)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Liquidity</p>
                    <p className="font-medium">{formatNumber(token.liquidity)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">MCap</p>
                    <p className="font-medium">{formatNumber(token.marketCap)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Txns</p>
                    <p className="font-medium">{token.txns24h.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Age</p>
                    <p className="font-medium">{token.age}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <a
                    href={`https://solscan.io/token/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Solscan
                    </Button>
                  </a>
                  <a
                    href={`https://dexscreener.com/solana/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      DexScreener
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
