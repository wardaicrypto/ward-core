export const dynamic = 'force-dynamic';

const recentlyAlerted = new Map<string, number>();
const ALERT_COOLDOWN = 120000; // 2 minutes cooldown per token

export async function GET() {
  try {
    const now = Date.now();
    for (const [key, timestamp] of recentlyAlerted.entries()) {
      if (now - timestamp > ALERT_COOLDOWN) {
        recentlyAlerted.delete(key);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    let response;
    try {
      response = await fetch(
        'https://api.dexscreener.com/token-boosts/top/v1',
        { 
          signal: controller.signal,
          cache: 'no-store',
        }
      );
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('[v0] DexScreener fetch error in alerts:', fetchError);
      return Response.json({ 
        alerts: generateFallbackAlerts(),
        timestamp: new Date().toISOString()
      });
    }
    
    if (!response.ok) {
      console.log('[v0] DexScreener API returned non-OK status:', response.status);
      return Response.json({ 
        alerts: generateFallbackAlerts(),
        timestamp: new Date().toISOString()
      });
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('[v0] DexScreener API returned non-JSON response, likely rate limited');
      return Response.json({ 
        alerts: generateFallbackAlerts(),
        timestamp: new Date().toISOString()
      });
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return Response.json({ 
        alerts: generateFallbackAlerts(),
        timestamp: new Date().toISOString()
      });
    }

    const solanaTokens = data
      .filter((token: any) => token.chainId === 'solana')
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, 10);

    const alertPromises = solanaTokens.map(async (token: any) => {
      try {
        if (recentlyAlerted.has(token.tokenAddress)) {
          return null;
        }

        const pairResponse = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${token.tokenAddress}`,
          { cache: 'no-store' }
        );
        
        if (!pairResponse.ok) return null;
        
        const pairContentType = pairResponse.headers.get('content-type');
        if (!pairContentType || !pairContentType.includes('application/json')) {
          console.log(`[v0] Non-JSON response for token ${token.tokenAddress}, skipping`);
          return null;
        }
        
        const pairData = await pairResponse.json();
        if (!pairData.pairs || pairData.pairs.length === 0) return null;
        
        const bestPair = pairData.pairs.sort((a: any, b: any) => 
          (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
        )[0];
        
        const alert = generateAdvancedAlert(bestPair);
        
        if (alert) {
          recentlyAlerted.set(token.tokenAddress, Date.now());
        }
        
        return alert;
      } catch {
        return null;
      }
    });

    const alerts = (await Promise.all(alertPromises)).filter(Boolean);

    const limitedAlerts = alerts.slice(0, 3);

    console.log('[v0] Received alerts:', limitedAlerts.length);

    return Response.json({ 
      alerts: limitedAlerts.length > 0 ? limitedAlerts : [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[v0] Live alerts error:', errorMessage);
    
    return Response.json({ 
      alerts: [],
      timestamp: new Date().toISOString()
    });
  }
}

function generateAdvancedAlert(pair: any) {
  const priceChange = pair.priceChange?.h24 || 0;
  const volume = pair.volume?.h24 || 0;
  const liquidity = pair.liquidity?.usd || 0;
  const buys = pair.txns?.h24?.buys || 0;
  const sells = pair.txns?.h24?.sells || 0;
  const buySellRatio = buys / (sells || 1);
  const liquidityToVolumeRatio = liquidity / (volume || 1);
  
  let type: 'critical' | 'warning' | 'info' | 'success' = 'info';
  let message = '';
  
  if (Math.abs(priceChange) > 150) {
    type = 'critical';
    message = `EXTREME ${priceChange > 0 ? '🚀 PUMP' : '💥 DUMP'}: ${Math.abs(priceChange).toFixed(0)}% swing detected!`;
  } else if (liquidity < 3000 && volume > 100000) {
    type = 'critical';
    message = `🚨 RUG PULL RISK: $${(liquidity/1000).toFixed(1)}K liquidity, $${(volume/1000).toFixed(0)}K volume`;
  } else if (liquidityToVolumeRatio < 0.02 && volume > 50000) {
    type = 'critical';
    message = `⚠️ MANIPULATION WARNING: Extremely low liquidity vs volume ratio`;
  } else if (Math.abs(priceChange) > 80) {
    type = 'warning';
    message = `${priceChange > 0 ? '📈 Rapid pump' : '📉 Sharp dump'}: ${Math.abs(priceChange).toFixed(0)}% in 24h`;
  } else if (buySellRatio < 0.3 && sells > 20) {
    type = 'warning';
    message = `🔻 SELLING PRESSURE: ${sells} sells overwhelming ${buys} buys`;
  } else if (liquidity < 10000 && volume > 50000) {
    type = 'warning';
    message = `⚡ Low liquidity alert: $${(liquidity/1000).toFixed(0)}K backing high volume`;
  } else if (priceChange > 40) {
    type = 'warning';
    message = `📊 Volatile: +${priceChange.toFixed(0)}% price surge - monitor for dump`;
  } else if (buySellRatio > 3 && buys > 30) {
    type = 'success';
    message = `✅ STRONG BUYING: ${buys} buys vs ${sells} sells - bullish momentum`;
  } else if (priceChange > 15 && priceChange < 35 && buySellRatio > 1.5) {
    type = 'success';
    message = `🟢 Healthy growth: +${priceChange.toFixed(0)}% with strong buy support`;
  } else if (liquidity > 100000 && liquidityToVolumeRatio > 0.5) {
    type = 'success';
    message = `💎 Solid liquidity: $${(liquidity/1000).toFixed(0)}K locked - low rug risk`;
  } else if (Math.abs(priceChange) > 10) {
    type = 'info';
    message = `📍 Moderate movement: ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(1)}% in 24h`;
  } else {
    type = 'info';
    message = `👀 Monitoring ${pair.baseToken.symbol} - stable trading activity`;
  }
  
  return {
    id: `${pair.baseToken.address}-${Date.now()}-${Math.random()}`,
    type,
    message,
    token: `${pair.baseToken.address.slice(0, 6)}...${pair.baseToken.address.slice(-4)}`,
    tokenAddress: pair.baseToken.address,
    tokenName: pair.baseToken.symbol,
    time: 'just now'
  };
}

function generateFallbackAlerts() {
  return [];
}
