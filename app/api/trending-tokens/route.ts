export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const response = await fetch(
      'https://api.dexscreener.com/token-boosts/top/v1',
      { 
        next: { revalidate: 60 },
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const boosts = await response.json();
    console.log('[v0] Fetched boosted tokens:', boosts.length);
    
    const solanaBoosts = boosts.filter((boost: any) => boost.chainId === 'solana');
    
    // Fetch trading data for each Solana token
    const solanaTokensData = await Promise.all(
      solanaBoosts.slice(0, 20).map(async (boost: any) => {
        try {
          const pairsResponse = await fetch(
            `https://api.dexscreener.com/latest/dex/tokens/${boost.tokenAddress}`,
            { 
              next: { revalidate: 60 },
              signal: AbortSignal.timeout(5000)
            }
          );
          
          if (!pairsResponse.ok) {
            if (pairsResponse.status === 429) {
              console.log(`[v0] Rate limited for token ${boost.tokenAddress}, skipping`);
            }
            return null;
          }
          
          const contentType = pairsResponse.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.log(`[v0] Non-JSON response for token ${boost.tokenAddress}, skipping`);
            return null;
          }
          
          const data = await pairsResponse.json();
          
          // Find the best Solana pair (highest liquidity)
          const solanaPair = data.pairs
            ?.filter((p: any) => p.chainId === 'solana')
            ?.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
          
          if (!solanaPair || !solanaPair.liquidity?.usd || solanaPair.liquidity.usd < 1000) {
            return null;
          }

          // Calculate token age from pairCreatedAt timestamp
          const getTokenAge = (timestamp: number) => {
            const now = Date.now();
            const ageMs = now - (timestamp || now);
            const ageMinutes = Math.floor(ageMs / 60000);
            const ageHours = Math.floor(ageMs / 3600000);
            const ageDays = Math.floor(ageMs / 86400000);
            
            if (ageMinutes < 60) return `${ageMinutes}mo`;
            if (ageHours < 24) return `${ageHours}h`;
            if (ageDays < 30) return `${ageDays}d`;
            return `${Math.floor(ageDays / 30)}mo`;
          };
          
          return {
            address: boost.tokenAddress,
            name: solanaPair.baseToken?.name || 'Unknown',
            symbol: solanaPair.baseToken?.symbol || 'UNKNOWN',
            priceUsd: solanaPair.priceUsd || '0',
            volume24h: solanaPair.volume?.h24 || 0,
            priceChange24h: solanaPair.priceChange?.h24 || 0,
            priceChange1h: solanaPair.priceChange?.h1 || 0,
            priceChange6h: solanaPair.priceChange?.h6 || 0,
            priceChange5m: solanaPair.priceChange?.m5 || 0,
            liquidity: solanaPair.liquidity?.usd || 0,
            marketCap: solanaPair.marketCap || solanaPair.fdv || 0,
            txns24h: (solanaPair.txns?.h24?.buys || 0) + (solanaPair.txns?.h24?.sells || 0),
            makers: solanaPair.txns?.h24?.buyers || 0,
            age: getTokenAge(solanaPair.pairCreatedAt),
            chainId: 'solana',
            dexId: solanaPair.dexId,
            pairAddress: solanaPair.pairAddress,
            url: solanaPair.url || `https://dexscreener.com/solana/${boost.tokenAddress}`,
            boostAmount: boost.totalAmount || 0
          };
        } catch (err) {
          console.error(`[v0] Error fetching token ${boost.tokenAddress}:`, err);
          return null;
        }
      })
    );

    const validTokens = solanaTokensData
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 10);

    console.log('[v0] Returning', validTokens.length, 'trending Solana tokens');

    return Response.json({ 
      pairs: validTokens,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[v0] Trending tokens fetch error:', error);
    
    return Response.json({ 
      error: 'Failed to fetch trending tokens',
      pairs: []
    }, { status: 200 });
  }
}
