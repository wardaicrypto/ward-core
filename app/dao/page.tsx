import { MarketGuardHeader } from "@/components/market-guard-header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vote, Lock, TrendingUp, Flame, Users, Shield, Lightbulb, ChevronRight } from "lucide-react"

export default function DAOPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketGuardHeader />

      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <Badge variant="outline" className="text-sm px-4 py-1.5">
            Coming Soon
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">Ward AI DAO</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Empowering token holders to shape the future of AI-powered security through decentralized governance
          </p>
        </section>

        {/* Key Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Vote className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Voting Power</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Your $WARD holdings determine your voting power. The more tokens you hold, the greater your influence on
                protocol decisions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <Lock className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>Token Unlock</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Community decides when and how locked tokens are released. Vote on unlock schedules to maintain
                stability and growth.
              </CardDescription>
              <div className="text-sm text-muted-foreground">Democratic unlock control</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>Marketing Budget</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Allocate treasury funds for marketing campaigns, partnerships, and community growth initiatives through
                DAO votes.
              </CardDescription>
              <div className="text-sm text-muted-foreground">Community-driven growth</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-orange-500/10">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <CardTitle>Token Burn</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Propose and vote on token burn mechanisms to reduce supply and increase scarcity based on protocol
                performance.
              </CardDescription>
              <div className="text-sm text-muted-foreground">Deflationary measures</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>Protocol Upgrades</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Vote on new security features, AI model improvements, and platform enhancements to keep Ward AI
                cutting-edge.
              </CardDescription>
              <div className="text-sm text-muted-foreground">Community-approved upgrades</div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle>Feature Proposals</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Submit and vote on new feature ideas, integrations, and improvements to shape the Ward AI roadmap.
              </CardDescription>
              <div className="text-sm text-muted-foreground">Community innovation</div>
            </CardContent>
          </Card>
        </section>

        {/* Governance Process */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">How Governance Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A transparent, decentralized decision-making process powered by token holders
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <CardTitle className="text-lg">Proposal</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Token holders submit proposals for protocol changes, fund allocation, or new features
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <CardTitle className="text-lg">Discussion</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Community discusses the proposal, provides feedback, and suggests improvements
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <CardTitle className="text-lg">Voting</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Token holders vote on the proposal based on their voting power (1 token = 1 vote)
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    4
                  </div>
                  <CardTitle className="text-lg">Execution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  If passed, the proposal is automatically executed through smart contracts
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Potential Voting Categories */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">What You Can Vote On</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Holders will have a say in critical protocol decisions
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    Treasury Management
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• Marketing budget allocation</li>
                    <li>• Partnership investments</li>
                    <li>• Development fund distribution</li>
                    <li>• Grant programs for builders</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    Tokenomics
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• Token burn schedules</li>
                    <li>• Unlock schedules and vesting</li>
                    <li>• Staking rewards adjustments</li>
                    <li>• Fee structure modifications</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    Platform Development
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• New feature prioritization</li>
                    <li>• Security module enhancements</li>
                    <li>• AI model upgrades</li>
                    <li>• Chain expansion decisions</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-primary" />
                    Governance
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                    <li>• Voting threshold adjustments</li>
                    <li>• Proposal requirements</li>
                    <li>• Emergency protocol measures</li>
                    <li>• DAO structure modifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-12">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-transparent">
            <CardContent className="py-12 space-y-6">
              <Users className="w-16 h-16 mx-auto text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Be Part of the Decision</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The Ward AI DAO will launch soon. Hold $WARD tokens to participate in governance and shape the future of
                decentralized security.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer hideBetaBanner={true} />
    </div>
  )
}
