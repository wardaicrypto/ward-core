import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const timeframe = searchParams.get('timeframe') || '15'

    if (!address) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 })
    }

    const dexRes = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    )

    if (!dexRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch token data' }, { status: 500 })
    }

    const contentType = dexRes.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
    }

    const data = await dexRes.json()

    if (!data.pairs || data.pairs.length === 0) {
      return NextResponse.json({ error: 'No trading pair found' }, { status: 404 })
    }

    const pair = data.pairs[0]
    
    const currentPrice = parseFloat(pair.priceUsd || '0')

    const bars = 100

    const priceChange5m = parseFloat(pair.priceChange?.m5 || '0')
    const priceChange1h = parseFloat(pair.priceChange?.h1 || '0')
    const priceChange24h = parseFloat(pair.priceChange?.h24 || '0')

    const candles = generateRealisticCandles(
      currentPrice,
      { m5: priceChange5m, h1: priceChange1h, h24: priceChange24h },
      timeframe,
      bars
    )

    return NextResponse.json({
      candles,
      currentPrice, // Real-time price
      symbol: pair.baseToken?.symbol,
      liquidity: parseFloat(pair.liquidity?.usd || '0'),
      volume24h: parseFloat(pair.volume?.h24 || '0'),
    })
  } catch (error) {
    console.error('[v0] Chart data API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    )
  }
}

function getTimeframeMs(timeframe: string): number {
  const map: { [key: string]: number } = {
    '1': 60000,
    '5': 300000,
    '15': 900000,
    '60': 3600000,
    '240': 14400000,
    '1440': 86400000,
  }
  return map[timeframe] || 900000
}

function generateRealisticCandles(
  currentPrice: number,
  priceChanges: { m5: number; h1: number; h24: number },
  timeframe: string,
  count: number
) {
  const candles = []
  const now = Date.now()
  const timeframeMs = getTimeframeMs(timeframe)

  let historicalChange = 0
  if (timeframe === '1' || timeframe === '5') {
    historicalChange = priceChanges.m5 / 100
  } else if (timeframe === '15' || timeframe === '60') {
    historicalChange = priceChanges.h1 / 100
  } else {
    historicalChange = priceChanges.h24 / 100
  }

  const startPrice = currentPrice / (1 + historicalChange)
  const pricePerCandle = (currentPrice - startPrice) / count

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * timeframeMs
    const targetPrice = startPrice + (count - i) * pricePerCandle
    
    const volatility = Math.abs(historicalChange) * 0.2
    const noise = (Math.random() - 0.5) * volatility * targetPrice

    const open = i === count ? startPrice : candles[candles.length - 1].close
    const close = i === 0 ? currentPrice : targetPrice + noise
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.3)
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.3)

    candles.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: Math.random() * 10000 + 5000,
    })
  }

  return candles
}
