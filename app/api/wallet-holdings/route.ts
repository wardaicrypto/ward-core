import { type NextRequest, NextResponse } from "next/server"

function isValidSolanaAddress(address: string): boolean {
  try {
    // Basic validation - Solana addresses are base58 and 32-44 characters
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const walletAddress = searchParams.get("address")

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
  }

  if (!isValidSolanaAddress(walletAddress)) {
    return NextResponse.json(
      {
        error: "Invalid Solana wallet address. Please check the address and try again.",
      },
      { status: 400 },
    )
  }

  const generateMockHoldings = () => {
    const mockTokens = [
      { symbol: "BONK", name: "Bonk", price: 0.000012, balance: 50000 },
      { symbol: "WIF", name: "dogwifhat", price: 2.34, balance: 10 },
      { symbol: "POPCAT", name: "Popcat", price: 0.87, balance: 25 },
      { symbol: "MEW", name: "cat in a dogs world", price: 0.0045, balance: 500 },
    ]

    return mockTokens.map((token, i) => ({
      address: `mock${i}${walletAddress.slice(-8)}`,
      symbol: token.symbol,
      name: token.name,
      balance: token.balance,
      value: token.balance * token.price,
      price: token.price,
      priceChange24h: (Math.random() - 0.5) * 10,
      riskScore: Math.floor(Math.random() * 30) + 10,
      alerts: [],
      liquidity: Math.random() * 100000 + 50000,
      holders: Math.floor(Math.random() * 10000) + 5000,
      topHolderPercent: Math.random() * 10 + 5,
      devHolding: Math.random() * 5 + 2,
      suspiciousActivity: false,
      decimals: 9,
      hasData: true,
    }))
  }

  console.log("[v0] Portfolio Protection is under maintenance - returning mock data")
  const mockHoldings = generateMockHoldings()
  const totalValue = mockHoldings.reduce((sum, h) => sum + h.value, 0)

  return NextResponse.json({
    holdings: mockHoldings,
    totalValue,
    tokensWithValue: mockHoldings.length,
    totalTokens: mockHoldings.length,
    isMockData: true,
    maintenanceMode: true,
  })
}
