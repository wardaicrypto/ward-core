import { NextResponse } from 'next/server'

// Mock data generator for token discovery
function generateMockTokens(category: string, limit?: number) {
  const symbols = ['DOGE', 'SHIB', 'PEPE', 'BONK', 'WIF', 'FLOKI', 'MEME', 'TURBO', 'WOJAK', 'POPCAT', 'MOG', 'BRETT', 'SNEK', 'MYRO', 'WEN', 'SILLY', 'PONKE', 'HPOS', 'DUKO', 'GIGA']
  const names = ['Dog Wif Hat', 'Pepe Coin', 'Bonk Inu', 'Shiba Inu', 'Floki Inu', 'Meme Token', 'Turbo Toad', 'Wojak Finance', 'Popcat Meme', 'Mog Coin', 'Brett', 'Snek Token', 'Myro Finance', 'Wen Moon', 'Silly Dragon', 'Ponke', 'HPOS10I', 'Duko', 'Giga Chad']
  const platforms = ['pump.fun', 'raydium', 'orca', 'meteora', 'fluxbeam', 'other'] as const
  
  const tokens = []
  const count = limit || 12

  for (let i = 0; i < count; i++) {
    const riskScore = category === 'safe' 
      ? Math.floor(Math.random() * 15) + 80 // 80-95 range for AI Verified Safe
      : category === 'new'
      ? Math.floor(Math.random() * 40) + 40
      : Math.floor(Math.random() * 60) + 30

    const contractScore = category === 'safe'
      ? Math.floor(Math.random() * 20) + 75 // 75-95 for safe tokens
      : Math.floor(Math.random() * 30) + 60

    const recommendation = riskScore >= 80 ? 'safe' : riskScore >= 60 ? 'moderate' : riskScore >= 40 ? 'caution' : 'avoid'
    
    const priceChange24h = (Math.random() - 0.4) * 100
    const isNew = category === 'new' || limit === 1
    
    const randomSymbolIndex = Math.floor(Math.random() * symbols.length)
    
    const marketCap = category === 'new' 
      ? Math.floor(Math.random() * 40000) + 5000 // 5k to 45k for new pairs
      : Math.floor(Math.random() * 10000000) + 100000 // 100k to 10M for others
    
    tokens.push({
      tokenAddress: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      symbol: symbols[randomSymbolIndex],
      name: names[randomSymbolIndex],
      logoUrl: `/placeholder.svg?height=48&width=48&query=${symbols[randomSymbolIndex]}`,
      age: isNew 
        ? `${Math.floor(Math.random() * 60)}s`
        : Math.random() > 0.5 
        ? `${Math.floor(Math.random() * 24)}h`
        : `${Math.floor(Math.random() * 7)}d`,
      marketCap,
      price: Math.random() * 10,
      fdv: Math.floor(Math.random() * 50000000) + 500000,
      liquidity: Math.floor(Math.random() * 5000000) + 50000,
      volume24h: Math.floor(Math.random() * 2000000) + 10000,
      priceChange1h: (Math.random() - 0.5) * 20,
      priceChange24h,
      priceChange7d: (Math.random() - 0.4) * 150,
      holders: Math.floor(Math.random() * 10000) + 100,
      buys24h: Math.floor(Math.random() * 500) + 50,
      sells24h: Math.floor(Math.random() * 500) + 50,
      riskScore,
      contractScore,
      sentimentScore: Math.floor(Math.random() * 40) + 60,
      recommendation,
      platform: platforms[Math.floor(Math.random() * platforms.length)]
    })
  }

  return tokens
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || 'new'
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? parseInt(limitParam) : undefined

  try {
    // In production, this would fetch from your API with real-time data
    const tokens = generateMockTokens(category, limit)

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error('[v0] Token discovery error:', error)
    return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 })
  }
}
