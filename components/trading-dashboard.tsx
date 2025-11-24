'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, DollarSign, Gift, Activity, ArrowUpRight, Clock, CheckCircle2, Calendar } from 'lucide-react'
import { PortfolioMonitor } from '@/components/portfolio-monitor'
import { ContractScanner } from '@/components/contract-scanner'
import { SentimentTracker } from '@/components/sentiment-tracker'
import { MLRiskScorer } from '@/components/ml-risk-scorer'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

interface AirdropReward {
  id: string
  tokenSymbol: string
  amount: number
  status: 'pending' | 'claimable' | 'claimed'
  earnedFrom: number
  claimableAt: Date
  distributionCycle: string
}

export function TradingDashboard() {
  const [totalVolume] = useState(125840)
  const [feesCollected] = useState(377.52)
  const [eligibleAirdrop] = useState(1896.45)
  const [volumeProgress] = useState(75)
  
  const [airdrops] = useState<AirdropReward[]>([
    {
      id: '1',
      tokenSymbol: 'WARD',
      amount: 1500,
      status: 'claimable',
      earnedFrom: 50000,
      claimableAt: new Date('2025-06-01'),
      distributionCycle: 'H1 2025'
    },
    {
      id: '2',
      tokenSymbol: 'WARD',
      amount: 750,
      status: 'pending',
      earnedFrom: 75840,
      claimableAt: new Date('2025-12-01'),
      distributionCycle: 'H2 2025'
    }
  ])

  const nextDistribution = new Date('2025-12-01')
  const daysUntilDistribution = Math.ceil((nextDistribution.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const nextTier = 150000
  const volumeToNextTier = nextTier - totalVolume

  return (
    <div className="space-y-8">
      {/* Dashboard Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-primary">
              <Activity className="h-4 w-4" />
              Total Volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold">${totalVolume.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>+12.5% this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-green-500">
              <DollarSign className="h-4 w-4" />
              Platform Fees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold">${feesCollected.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Used for innovation</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-purple-500">
              <Gift className="h-4 w-4" />
              Eligible Airdrop
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-3xl font-bold">${eligibleAirdrop.toLocaleString()}</p>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/20">
                  2,250 WARD
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-blue-500">
              <Calendar className="h-4 w-4" />
              Next Distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{daysUntilDistribution} days</p>
              <p className="text-xs text-muted-foreground">Dec 1, 2025</p>
              <Badge variant="outline" className="text-xs">H2 2025</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Airdrop Rewards Panel */}
      <Card className="border-2 border-primary/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Airdrop Rewards Program
              </CardTitle>
              <CardDescription>
                Earn WARD tokens based on your trading volume. Airdrops distributed every 6 months.
              </CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-primary to-purple-500">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Reward Tiers */}
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Bronze Tier</span>
                  <Badge variant="outline" className="text-xs">$0 - $50K</Badge>
                </div>
                <p className="text-2xl font-bold text-muted-foreground">500 WARD</p>
                <p className="text-xs text-muted-foreground mt-1">Per 6-month cycle</p>
              </div>

              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5 relative">
                <Badge className="absolute -top-2 -right-2 text-xs">Current</Badge>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Silver Tier</span>
                  <Badge variant="outline" className="text-xs bg-primary/10">$50K - $150K</Badge>
                </div>
                <p className="text-2xl font-bold text-primary">2,250 WARD</p>
                <p className="text-xs text-muted-foreground mt-1">Per 6-month cycle</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Gold Tier</span>
                  <Badge variant="outline" className="text-xs">$150K+</Badge>
                </div>
                <p className="text-2xl font-bold text-muted-foreground">5,000+ WARD</p>
                <p className="text-xs text-muted-foreground mt-1">Per 6-month cycle</p>
              </div>
            </div>

            {/* Pending & Claimable Airdrops */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Your Airdrops</h3>
              
              {airdrops.map((airdrop) => (
                <div
                  key={airdrop.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    airdrop.status === 'claimable'
                      ? 'border-green-500/30 bg-green-500/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        airdrop.status === 'claimable'
                          ? 'bg-green-500/10'
                          : 'bg-muted'
                      }`}
                    >
                      {airdrop.status === 'claimable' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">
                        {airdrop.amount.toLocaleString()} {airdrop.tokenSymbol}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {airdrop.distributionCycle} • ${airdrop.earnedFrom.toLocaleString()} volume
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {airdrop.status === 'claimable'
                          ? 'Ready to claim now'
                          : `Claimable ${airdrop.claimableAt.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant={airdrop.status === 'claimable' ? 'default' : 'outline'}
                    disabled={airdrop.status !== 'claimable'}
                  >
                    {airdrop.status === 'claimable' ? 'Claim Now' : 'Pending'}
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">How It Works</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Trade on our platform like you would on Axiom or Jupiter. All trading fees (0.3% of volume) 
                    are collected by the platform to fund innovation and development. Based on your trading volume 
                    during each 6-month cycle, you become eligible for WARD token airdrops distributed at the end 
                    of each cycle (June & December). Higher volume means higher tier rewards. Keep trading to 
                    maximize your airdrop allocation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Trading Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Trading Tools</CardTitle>
          <CardDescription>
            Professional-grade analytics and AI-powered risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="scanner">Contract</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="ml">ML Risk</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-6">
              <PortfolioMonitor />
            </TabsContent>

            <TabsContent value="scanner" className="mt-6">
              <ContractScanner />
            </TabsContent>

            <TabsContent value="sentiment" className="mt-6">
              <SentimentTracker />
            </TabsContent>

            <TabsContent value="ml" className="mt-6">
              <MLRiskScorer />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
