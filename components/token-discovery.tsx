'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Clock, Users, Search, ChevronDown, Wallet, Filter, Star, Lock, Copy, Eye, MessageCircle, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TokenMetrics {
  tokenAddress: string
  symbol: string
  name: string
  logoUrl: string
  age: string
  marketCap: number
  price: number
  fdv: number
  liquidity: number
  volume24h: number
  priceChange1h: number
  priceChange24h: number
  priceChange7d: number
  holders: number
  buys24h: number
  sells24h: number
  riskScore: number
  contractScore: number
  sentimentScore: number
  recommendation: 'safe' | 'moderate' | 'caution' | 'avoid'
  platform?: 'pump.fun' | 'raydium' | 'orca' | 'meteora' | 'fluxbeam' | 'other'
}

const PLATFORMS = [
  { id: 'pump.fun', label: 'Pump.fun' },
  { id: 'raydium', label: 'Raydium' },
  { id: 'orca', label: 'Orca' },
  { id: 'meteora', label: 'Meteora' },
  { id: 'fluxbeam', label: 'Fluxbeam' },
  { id: 'other', label: 'Other' },
]

export function TokenDiscovery() {
  const [activeTab, setActiveTab] = useState<'new' | 'trending' | 'safe'>('new')
  const [searchQuery, setSearchQuery] = useState('')
  const [tokens, setTokens] = useState<TokenMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [newTokenIds, setNewTokenIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const addNewToken = async () => {
      try {
        const response = await fetch(`/api/tokens/discovery?category=${activeTab}&limit=1`)
        const data = await response.json()
        if (data.tokens && data.tokens.length > 0) {
          const newToken = data.tokens[0]
          const uniqueId = `${newToken.tokenAddress}_${Date.now()}`
          newToken.tokenAddress = uniqueId
          
          setTokens(prevTokens => {
            const updatedTokens = [newToken, ...prevTokens].slice(0, 50)
            return updatedTokens
          })
          
          setNewTokenIds(prev => new Set(prev).add(uniqueId))
          
          setTimeout(() => {
            setNewTokenIds(prev => {
              const next = new Set(prev)
              next.delete(uniqueId)
              return next
            })
          }, 2000)
        }
      } catch (error) {
        console.error('Failed to add new token:', error)
      }
    }

    const interval = setInterval(addNewToken, 7000)
    return () => clearInterval(interval)
  }, [activeTab])

  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prevTokens => 
        prevTokens.map(token => ({
          ...token,
          price: token.price * (1 + (Math.random() - 0.5) * 0.02),
          priceChange1h: token.priceChange1h + (Math.random() - 0.5) * 2,
          marketCap: token.marketCap * (1 + (Math.random() - 0.5) * 0.015),
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchTokens()
  }, [activeTab])

  const fetchTokens = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/tokens/discovery?category=${activeTab}`)
      const data = await response.json()
      setTokens(data.tokens || [])
      setNewTokenIds(new Set())
    } catch (error) {
      console.error('Failed to fetch tokens:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const TokenCard = ({ token, isNew }: { token: TokenMetrics; isNew: boolean }) => {
    const showAlert = activeTab === 'safe' && token.recommendation !== 'safe'
    const isUnsafe = token.riskScore < 80 || token.contractScore < 70
    
    return (
      <Card 
        className={`bg-zinc-950 border-zinc-800 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 p-4 space-y-3 ${showAlert ? 'border-red-500/50' : ''} ${isNew ? 'border-cyan-500/50 animate-in slide-in-from-top-4 fade-in duration-500' : ''}`}
      >
        {isNew && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            NEW
          </div>
        )}
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center overflow-hidden border border-zinc-800 flex-shrink-0 relative group-hover:border-zinc-700 transition-colors">
              {token.logoUrl ? (
                <img src={token.logoUrl || "/placeholder.svg"} alt={token.symbol} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <span className="text-base font-bold text-zinc-600">{token.symbol.charAt(0)}</span>
              )}
              {token.riskScore >= 80 && (
                <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-0.5 animate-in zoom-in duration-300">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              )}
              {isUnsafe && (
                <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-0.5 animate-pulse">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white truncate">{token.symbol}</h3>
                <span className="text-xs text-zinc-500 truncate hidden sm:inline">{token.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                <span className="text-emerald-400 font-medium">{token.age}</span>
                <Copy className="h-3.5 w-3.5 hover:text-white transition-colors cursor-pointer" />
                <Lock className="h-3.5 w-3.5 hidden sm:inline" />
                <Eye className="h-3.5 w-3.5 hover:text-white transition-colors cursor-pointer hidden sm:inline" />
                <span className="flex items-center gap-1 hidden sm:flex">
                  <Star className="h-3.5 w-3.5" />
                  {token.holders}
                </span>
                <MessageCircle className="h-3.5 w-3.5 hover:text-white transition-colors cursor-pointer hidden md:inline" />
                <span className="hidden md:inline">0</span>
                <span className="flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  {token.contractScore}/{token.riskScore}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">MC</p>
            <p className="text-sm font-bold text-cyan-400 transition-all duration-300">{formatNumber(token.marketCap)}</p>
            <p className="text-xs text-zinc-400 mt-0.5">v {formatNumber(token.price)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
          <div className={`flex items-center gap-1 transition-colors duration-300 ${token.priceChange1h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {token.priceChange1h >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span className="font-medium">{Math.abs(token.priceChange1h).toFixed(1)}%</span>
          </div>
          <div className={`flex items-center gap-1 transition-colors duration-300 ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">{Math.abs(token.priceChange24h).toFixed(1)}%</span>
            <span className="text-zinc-600 text-[10px]">4m</span>
          </div>
          <div className={`flex items-center gap-1 transition-colors duration-300 ${token.priceChange7d >= 0 ? 'text-green-400' : 'text-red-400'} hidden sm:flex`}>
            {token.priceChange7d >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span className="font-medium">{Math.abs(token.priceChange7d).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1 text-green-400 hidden md:flex">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-medium">0%</span>
          </div>
          <div className="flex items-center gap-1 text-green-400 hidden md:flex">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-medium">0%</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-zinc-600 flex-wrap">
            <span>F = <span className="text-white">0.0{Math.floor(Math.random() * 9)}</span></span>
            <span>TX <span className="text-white">{Math.floor(Math.random() * 100)}</span></span>
            {token.platform && (
              <span className="text-zinc-500 hidden sm:inline">
                {token.tokenAddress.substring(0, 6)}...{token.platform === 'pump.fun' ? 'pump' : token.platform}
              </span>
            )}
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 text-white text-xs sm:text-sm h-7 px-3 sm:px-4 font-semibold transition-all duration-200"
            size="sm"
          >
            ⚡ 0.SOL
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-black min-h-screen">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto">
          <div className="flex items-center gap-1 bg-zinc-900/50 rounded-lg p-1 border border-zinc-800 flex-shrink-0">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('new')}
              size="sm"
              className={`text-xs sm:text-sm h-8 px-3 sm:px-4 transition-all duration-200 whitespace-nowrap ${activeTab === 'new' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              New Pairs
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('trending')}
              size="sm"
              className={`text-xs sm:text-sm h-8 px-3 sm:px-4 transition-all duration-200 whitespace-nowrap ${activeTab === 'trending' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Trending
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('safe')}
              size="sm"
              className={`text-xs sm:text-sm h-8 px-3 sm:px-4 transition-all duration-200 whitespace-nowrap ${activeTab === 'safe' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              AI Safe
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-xs sm:text-sm h-9 transition-all duration-200">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Platform</span>
                {selectedPlatforms.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-blue-600 text-white text-xs h-5 px-2 animate-in zoom-in duration-200">
                    {selectedPlatforms.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
              <DropdownMenuLabel className="text-zinc-400">Filter by Platform</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              {PLATFORMS.map((platform) => (
                <DropdownMenuCheckboxItem
                  key={platform.id}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => togglePlatform(platform.id)}
                  className="text-zinc-300 focus:bg-zinc-800 focus:text-white transition-colors"
                >
                  {platform.label}
                </DropdownMenuCheckboxItem>
              ))}
              {selectedPlatforms.length > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlatforms([])}
                    className="w-full text-zinc-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="relative flex-1 sm:flex-initial sm:w-48 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white text-sm h-9 focus:border-cyan-600 transition-colors"
            />
          </div>
          <Button
            onClick={() => setIsWalletConnected(!isWalletConnected)}
            size="sm"
            className={`h-9 text-xs sm:text-sm px-3 sm:px-4 transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap ${isWalletConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
          >
            <Wallet className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{isWalletConnected ? 'Connected' : 'Connect'}</span>
            <span className="sm:hidden">{isWalletConnected ? '✓' : 'Connect'}</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="bg-zinc-950 border-zinc-800 p-4 h-52 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {tokens
            .filter(token => {
              const matchesSearch = searchQuery === '' || 
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.name.toLowerCase().includes(searchQuery.toLowerCase())
              
              const matchesPlatform = selectedPlatforms.length === 0 || 
                (token.platform && selectedPlatforms.includes(token.platform))
              
              return matchesSearch && matchesPlatform
            })
            .map((token) => (
              <TokenCard 
                key={token.tokenAddress} 
                token={token} 
                isNew={newTokenIds.has(token.tokenAddress)}
              />
            ))}
        </div>
      )}
    </div>
  )
}
