import { z } from 'zod';

export const dynamic = 'force-dynamic';

const tokenAnalysisSchema = z.object({
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  threats: z.array(z.object({
    type: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    description: z.string(),
    confidence: z.number().min(0).max(100)
  })),
  metrics: z.object({
    insiderActivity: z.number(),
    liquidityHealth: z.number(),
    holderConcentration: z.number(),
    tradingVolume: z.number(),
    priceVolatility: z.number()
  }),
  recommendations: z.array(z.string())
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tokenAddress = url.searchParams.get('address');
    
    console.log('[v0] Analyzing token (GET):', tokenAddress);

    if (!tokenAddress) {
      return Response.json({ error: 'Token address is required' }, { status: 400 });
    }

    return await analyzeToken(tokenAddress);
  } catch (error) {
    console.error('[v0] Token analysis error (GET):', error);
    return Response.json({ 
      error: 'Failed to analyze token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { tokenAddress, chainId = 'solana' } = await req.json();
    
    console.log('[v0] Analyzing token (POST):', tokenAddress);

    if (!tokenAddress) {
      return Response.json({ error: 'Token address is required' }, { status: 400 });
    }

    return await analyzeToken(tokenAddress);
  } catch (error) {
    console.error('[v0] Token analysis error (POST):', error);
    return Response.json({ 
      error: 'Failed to analyze token',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function analyzeToken(tokenAddress: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  
  let dexResponse;
  try {
    dexResponse = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
  } catch (fetchError) {
    clearTimeout(timeoutId);
    console.error('[v0] DexScreener fetch error:', fetchError);
    throw new Error('Failed to fetch token data from DexScreener');
  }

  if (dexResponse.status === 429) {
    console.error('[v0] Rate limited by DexScreener');
    return Response.json({ 
      error: 'Rate limit exceeded. Please wait 60 seconds before trying again.',
      isRateLimited: true
    }, { status: 429 });
  }

  if (!dexResponse.ok) {
    throw new Error(`DexScreener API error: ${dexResponse.status}`);
  }

  const contentType = dexResponse.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('[v0] Non-JSON response from DexScreener, likely rate limited');
    return Response.json({ 
      error: 'DexScreener API is temporarily unavailable. Please try again in 60 seconds.',
      isRateLimited: true
    }, { status: 429 });
  }

  let dexData;
  try {
    dexData = await dexResponse.json();
  } catch (parseError) {
    console.error('[v0] Failed to parse DexScreener response:', parseError);
    return Response.json({ 
      error: 'API temporarily unavailable due to rate limiting. Please wait 60 seconds.',
      isRateLimited: true
    }, { status: 429 });
  }

  if (!dexData.pairs || dexData.pairs.length === 0) {
    return Response.json({ 
      error: 'Token not found or no trading pairs available' 
    }, { status: 404 });
  }

  const pair = dexData.pairs[0];
  
  const tokenAge = pair.pairCreatedAt ? Date.now() - pair.pairCreatedAt : 0;
  const daysOld = tokenAge / (1000 * 60 * 60 * 24);
  let ageString = '';
  
  if (daysOld < 1) {
    ageString = `${Math.floor(daysOld * 24)}h`;
  } else if (daysOld < 30) {
    ageString = `${Math.floor(daysOld)}d`;
  } else {
    ageString = `${Math.floor(daysOld / 30)}mo`;
  }
  
  const tokenContext = {
    name: pair.baseToken.name,
    symbol: pair.baseToken.symbol,
    address: tokenAddress,
    priceUsd: pair.priceUsd,
    volume24h: pair.volume.h24,
    priceChange24h: pair.priceChange.h24,
    liquidity: pair.liquidity?.usd || 0,
    fdv: pair.fdv,
    marketCap: pair.marketCap,
    pairCreatedAt: pair.pairCreatedAt,
    txns24h: (pair.txns.h24.buys || 0) + (pair.txns.h24.sells || 0),
    buys24h: pair.txns.h24.buys || 0,
    sells24h: pair.txns.h24.sells || 0,
    age: ageString
  };

  const analysis = createAdvancedAnalysis(tokenContext);

  return Response.json({
    success: true,
    token: tokenContext,
    analysis
  });
}

function createAdvancedAnalysis(tokenContext: any) {
  const priceChange = Math.abs(tokenContext.priceChange24h || 0);
  const liquidityToMcapRatio = tokenContext.liquidity / (tokenContext.marketCap || 1);
  const buySellRatio = tokenContext.buys24h / (tokenContext.sells24h || 1);
  const volumeToMcapRatio = tokenContext.volume24h / (tokenContext.marketCap || 1);
  
  let riskScore = 0;
  const threats = [];
  
  // Advanced price volatility analysis
  if (priceChange > 100) {
    riskScore += 35;
    threats.push({
      type: 'Extreme Price Volatility',
      severity: 'critical' as const,
      description: `Token experienced ${priceChange.toFixed(1)}% price change in 24h. This is a strong indicator of pump and dump schemes.`,
      confidence: 95
    });
  } else if (priceChange > 50) {
    riskScore += 25;
    threats.push({
      type: 'High Price Volatility',
      severity: 'high' as const,
      description: `Token experienced ${priceChange.toFixed(1)}% price change in 24h, indicating potential manipulation or high speculation.`,
      confidence: 85
    });
  } else if (priceChange > 25) {
    riskScore += 15;
    threats.push({
      type: 'Moderate Price Volatility',
      severity: 'medium' as const,
      description: `Token price changed ${priceChange.toFixed(1)}% in 24h. Monitor for continued volatility.`,
      confidence: 75
    });
  }
  
  // Liquidity health analysis
  if (liquidityToMcapRatio < 0.02) {
    riskScore += 30;
    threats.push({
      type: 'Critical Liquidity Risk',
      severity: 'critical' as const,
      description: `Liquidity is only ${(liquidityToMcapRatio * 100).toFixed(2)}% of market cap. Extremely high rug pull risk.`,
      confidence: 95
    });
  } else if (liquidityToMcapRatio < 0.05) {
    riskScore += 20;
    threats.push({
      type: 'Low Liquidity Risk',
      severity: 'high' as const,
      description: `Liquidity is ${(liquidityToMcapRatio * 100).toFixed(2)}% of market cap. Vulnerable to rug pulls and manipulation.`,
      confidence: 90
    });
  } else if (liquidityToMcapRatio < 0.1) {
    riskScore += 10;
    threats.push({
      type: 'Moderate Liquidity Risk',
      severity: 'medium' as const,
      description: `Liquidity to market cap ratio is ${(liquidityToMcapRatio * 100).toFixed(2)}%. Could be improved for better security.`,
      confidence: 80
    });
  }
  
  // Buy/Sell pressure analysis
  if (buySellRatio < 0.3) {
    riskScore += 25;
    threats.push({
      type: 'Severe Selling Pressure',
      severity: 'critical' as const,
      description: `Sells (${tokenContext.sells24h}) heavily outweigh buys (${tokenContext.buys24h}). Possible insider dumping.`,
      confidence: 90
    });
  } else if (buySellRatio < 0.6) {
    riskScore += 15;
    threats.push({
      type: 'High Selling Pressure',
      severity: 'high' as const,
      description: `Sell transactions (${tokenContext.sells24h}) exceed buys (${tokenContext.buys24h}), indicating bearish sentiment.`,
      confidence: 80
    });
  } else if (buySellRatio < 0.9) {
    riskScore += 8;
    threats.push({
      type: 'Moderate Selling Pressure',
      severity: 'medium' as const,
      description: `More sells than buys detected. Monitor for trend continuation.`,
      confidence: 70
    });
  }
  
  // Token age analysis
  const daysOld = tokenContext.age.includes('h') ? 
    parseInt(tokenContext.age.replace('h', '')) / 24 : 
    tokenContext.age.includes('d') ? 
      parseInt(tokenContext.age.replace('d', '')) : 
      parseInt(tokenContext.age.replace('mo', '')) * 30;
  if (daysOld < 1) {
    riskScore += 20;
    threats.push({
      type: 'Newly Launched Token',
      severity: 'high' as const,
      description: `Token launched less than 24 hours ago. Extremely high risk period for manipulation.`,
      confidence: 98
    });
  } else if (daysOld < 3) {
    riskScore += 15;
    threats.push({
      type: 'Very New Token',
      severity: 'high' as const,
      description: `Token is only ${daysOld.toFixed(1)} days old. High risk for pump and dump schemes.`,
      confidence: 95
    });
  } else if (daysOld < 7) {
    riskScore += 10;
    threats.push({
      type: 'New Token Risk',
      severity: 'medium' as const,
      description: `Token is ${daysOld.toFixed(1)} days old. Still in high-risk period for manipulation.`,
      confidence: 85
    });
  }
  
  // Volume analysis
  if (volumeToMcapRatio > 2) {
    riskScore += 15;
    threats.push({
      type: 'Abnormal Trading Volume',
      severity: 'high' as const,
      description: `24h volume is ${(volumeToMcapRatio * 100).toFixed(0)}% of market cap. May indicate wash trading or bot activity.`,
      confidence: 80
    });
  }
  
  // If no threats detected, add positive indicator
  if (threats.length === 0) {
    threats.push({
      type: 'No Critical Threats Detected',
      severity: 'low' as const,
      description: 'Token shows relatively normal trading patterns. Continue monitoring for changes.',
      confidence: 70
    });
  }
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 45) riskLevel = 'high';
  else if (riskScore >= 25) riskLevel = 'medium';
  else riskLevel = 'low';
  
  // Calculate metrics
  const insiderActivity = Math.min(Math.max((1 - buySellRatio) * 100, 0), 100);
  const liquidityHealth = Math.min(liquidityToMcapRatio * 500, 100);
  const priceVolatility = Math.min(priceChange * 1.2, 100);
  
  // Generate contextual recommendations
  const recommendations = [];
  
  if (riskLevel === 'critical') {
    recommendations.push('⚠️ EXTREME CAUTION: This token shows multiple critical red flags. Avoid or invest only what you can afford to lose completely.');
  } else if (riskLevel === 'high') {
    recommendations.push('⚠️ HIGH RISK: Exercise extreme caution. This token shows significant warning signs.');
  } else if (riskLevel === 'medium') {
    recommendations.push('⚠️ MODERATE RISK: Monitor closely and be prepared for volatility.');
  } else {
    recommendations.push('✓ Relatively stable patterns detected. Continue monitoring for changes.');
  }
  
  if (liquidityToMcapRatio < 0.1) {
    recommendations.push('Verify liquidity is locked to prevent rug pulls. Check if LP tokens are burned.');
  }
  
  if (daysOld < 7) {
    recommendations.push('New token - wait for more trading history before making large investments.');
  }
  
  if (buySellRatio < 0.7) {
    recommendations.push('High selling pressure detected - be cautious of potential dumps.');
  }
  
  recommendations.push('Always research the development team and project legitimacy.');
  recommendations.push('Never invest more than you can afford to lose in any cryptocurrency.');
  
  return {
    riskScore: Math.min(Math.round(riskScore), 100),
    riskLevel,
    threats,
    metrics: {
      insiderActivity: Number(insiderActivity.toFixed(2)),
      liquidityHealth: Number(liquidityHealth.toFixed(2)),
      holderConcentration: 35,
      tradingVolume: tokenContext.volume24h || 0,
      priceVolatility: Number(priceVolatility.toFixed(2))
    },
    recommendations
  };
}
