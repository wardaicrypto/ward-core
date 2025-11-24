'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LiveTradingChart } from '@/components/live-trading-chart'
import { TrendingUp, TrendingDown, Activity, Settings, Maximize2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

export function TradingTerminal() {
  const [selectedToken, setSelectedToken] = useState({
    symbol: 'BTC',
    address: 'bitcoin',
    price: 91746,
    change: 1.39
  })
  const [orderSide, setOrderSide] = useState<'long' | 'short'>('long')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [leverage, setLeverage] = useState(20)
  const [amount, setAmount] = useState('')

  // Market tickers
  const marketTickers = [
    { symbol: 'BTC', change: 1.41, price: 91746 },
    { symbol: 'ETH', change: 1.54, price: 3421 },
    { symbol: 'SOL', change: 2.49, price: 185 }
  ]

  // Order book data (mock)
  const orderBook = {
    asks: Array.from({ length: 15 }, (_, i) => ({
      price: 91750 + i * 3,
      amount: (Math.random() * 3).toFixed(3),
      total: (Math.random() * 100).toFixed(2)
    })),
    bids: Array.from({ length: 15 }, (_, i) => ({
      price: 91749 - i * 3,
      amount: (Math.random() * 3).toFixed(3),
      total: (Math.random() * 100).toFixed(2)
    }))
  }

  // Recent trades (mock)
  const recentTrades = Array.from({ length: 20 }, (_, i) => ({
    price: 91750 + (Math.random() - 0.5) * 10,
    amount: (Math.random() * 2).toFixed(4),
    side: Math.random() > 0.5 ? 'buy' : 'sell',
    time: new Date(Date.now() - i * 30000).toLocaleTimeString()
  }))

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-zinc-950">
      {/* Market Ticker Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-4 py-2 flex items-center gap-6">
        {marketTickers.map((ticker) => (
          <div key={ticker.symbol} className="flex items-center gap-2 text-sm">
            <span className="font-medium">{ticker.symbol}</span>
            <span className={ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {ticker.change >= 0 ? '+' : ''}{ticker.change}%
            </span>
          </div>
        ))}
      </div>

      {/* Main Trading Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chart */}
        <div className="flex-1 flex flex-col border-r border-zinc-800 overflow-hidden">
          {/* Token Info Header */}
          <div className="border-b border-zinc-800 bg-zinc-900/30 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{selectedToken.symbol}</span>
                  <Badge variant={selectedToken.change >= 0 ? 'default' : 'destructive'} className="text-xs">
                    {selectedToken.change >= 0 ? '+' : ''}{selectedToken.change}%
                  </Badge>
                </div>
                <div className="text-3xl font-bold mt-1">
                  {selectedToken.price.toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-zinc-500 space-y-1">
                <div>Oracle Price: <span className="text-zinc-300">${selectedToken.price.toLocaleString()}</span></div>
                <div>24h Volume: <span className="text-zinc-300">$3.82B</span></div>
                <div>Open Interest: <span className="text-zinc-300">$2.62B</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 p-4 overflow-auto">
            <LiveTradingChart 
              tokenAddress={selectedToken.address}
              symbol={selectedToken.symbol}
              currentPrice={selectedToken.price}
            />
          </div>

          {/* Positions/Orders Tabs */}
          <div className="border-t border-zinc-800 bg-zinc-900/30">
            <Tabs defaultValue="positions" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-transparent h-10">
                <TabsTrigger value="positions" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                  Positions
                </TabsTrigger>
                <TabsTrigger value="orders" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                  Open Orders
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                  Trade History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="positions" className="p-4 min-h-[150px]">
                <div className="flex items-center justify-center h-24 text-zinc-500 text-sm">
                  No open positions
                </div>
              </TabsContent>
              <TabsContent value="orders" className="p-4 min-h-[150px]">
                <div className="flex items-center justify-center h-24 text-zinc-500 text-sm">
                  No open orders
                </div>
              </TabsContent>
              <TabsContent value="history" className="p-4 min-h-[150px]">
                <div className="flex items-center justify-center h-24 text-zinc-500 text-sm">
                  No trade history
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right: Order Book & Trading Panel */}
        <div className="w-[480px] flex flex-col">
          {/* Order Book & Trades */}
          <div className="flex-1 border-b border-zinc-800">
            <Tabs defaultValue="orderbook" className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-zinc-900/30 h-10 shrink-0">
                <TabsTrigger value="orderbook" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                  Order Book
                </TabsTrigger>
                <TabsTrigger value="trades" className="rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
                  Trades
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orderbook" className="flex-1 overflow-hidden m-0">
                <div className="h-full flex flex-col">
                  {/* Asks */}
                  <div className="flex-1 overflow-auto">
                    <div className="px-3 py-1 text-xs text-zinc-500 flex justify-between border-b border-zinc-800 bg-zinc-900/30 sticky top-0">
                      <span>Price (USDC)</span>
                      <span>Amount (USD)</span>
                      <span>Total (USD)</span>
                    </div>
                    <div className="flex flex-col-reverse">
                      {orderBook.asks.map((ask, i) => (
                        <div key={i} className="px-3 py-0.5 text-xs flex justify-between hover:bg-zinc-800/50 relative">
                          <div className="absolute inset-0 bg-red-500/5" style={{ width: `${(parseFloat(ask.total) / 100) * 100}%` }} />
                          <span className="text-red-400 relative z-10">{ask.price.toLocaleString()}</span>
                          <span className="text-zinc-400 relative z-10">{ask.amount}</span>
                          <span className="text-zinc-400 relative z-10">{ask.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spread */}
                  <div className="px-3 py-2 text-center border-y border-zinc-800 bg-zinc-900/50">
                    <div className="text-lg font-bold text-green-400">91,750</div>
                    <div className="text-xs text-zinc-500">Spread: 1 (0.001%)</div>
                  </div>

                  {/* Bids */}
                  <div className="flex-1 overflow-auto">
                    {orderBook.bids.map((bid, i) => (
                      <div key={i} className="px-3 py-0.5 text-xs flex justify-between hover:bg-zinc-800/50 relative">
                        <div className="absolute inset-0 bg-green-500/5" style={{ width: `${(parseFloat(bid.total) / 100) * 100}%` }} />
                        <span className="text-green-400 relative z-10">{bid.price.toLocaleString()}</span>
                        <span className="text-zinc-400 relative z-10">{bid.amount}</span>
                        <span className="text-zinc-400 relative z-10">{bid.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="trades" className="flex-1 overflow-auto m-0">
                <div className="px-3 py-1 text-xs text-zinc-500 flex justify-between border-b border-zinc-800 bg-zinc-900/30 sticky top-0">
                  <span>Price (USDC)</span>
                  <span>Amount (USD)</span>
                  <span>Time</span>
                </div>
                {recentTrades.map((trade, i) => (
                  <div key={i} className="px-3 py-1 text-xs flex justify-between hover:bg-zinc-800/50">
                    <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                      {trade.price.toFixed(2)}
                    </span>
                    <span className="text-zinc-400">{trade.amount}</span>
                    <span className="text-zinc-500">{trade.time}</span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Trading Panel */}
          <div className="h-[420px] p-4 bg-zinc-900/30 overflow-auto">
            {/* Long/Short Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                onClick={() => setOrderSide('long')}
                className={`h-10 ${orderSide === 'long' ? 'bg-green-600 hover:bg-green-700' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                Long
              </Button>
              <Button
                onClick={() => setOrderSide('short')}
                className={`h-10 ${orderSide === 'short' ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              >
                Short
              </Button>
            </div>

            {/* Market/Limit Tabs */}
            <div className="flex gap-2 mb-4 text-sm">
              <Button
                variant={orderType === 'market' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setOrderType('market')}
                className="h-8"
              >
                Market
              </Button>
              <Button
                variant={orderType === 'limit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setOrderType('limit')}
                className="h-8"
              >
                Limit
              </Button>
            </div>

            {/* Leverage Slider */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Leverage</span>
                <span className="font-medium">{leverage}x</span>
              </div>
              <Slider
                value={[leverage]}
                onValueChange={(v) => setLeverage(v[0])}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
                <span>75x</span>
                <span>100x</span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm text-zinc-400">Buy Amount</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16 bg-zinc-800 border-zinc-700"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
                  {selectedToken.symbol}
                </span>
              </div>
            </div>

            {/* TP/SL */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="text-xs text-zinc-400">TP/SL</label>
                <Input placeholder="Take Profit" className="h-9 bg-zinc-800 border-zinc-700 text-sm" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 opacity-0">.</label>
                <Input placeholder="Stop Loss" className="h-9 bg-zinc-800 border-zinc-700 text-sm" />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Available Margin</span>
                <span className="text-zinc-200">0.00 USDC</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Position Value</span>
                <span className="text-zinc-200">0.00 USDC</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Est. Liq. Price</span>
                <span className="text-zinc-200">--</span>
              </div>
            </div>

            {/* Trade Button */}
            <Button 
              className={`w-full h-12 text-base font-medium ${
                orderSide === 'long' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Add More Funds
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
