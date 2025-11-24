import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, Eye, Zap } from 'lucide-react'

const modules = [
  {
    title: 'Insider Selling Detection',
    description: 'Real-time monitoring of insider wallet activity during token launches',
    status: 'active',
    icon: Eye,
    metrics: { detected: 47, blocked: 39 }
  },
  {
    title: 'Liquidity Drain Prevention',
    description: 'Automatic alerts and safeguards when liquidity begins draining',
    status: 'active',
    icon: Shield,
    metrics: { detected: 23, blocked: 23 }
  },
  {
    title: 'Deployer LP Withdrawal Guard',
    description: 'Protection against deployer LP withdrawal attacks and rug pulls',
    status: 'active',
    icon: Lock,
    metrics: { detected: 15, blocked: 14 }
  },
  {
    title: 'Sniper Volume Detection',
    description: 'Identifies and prevents snipers from cycling artificial volume',
    status: 'active',
    icon: Zap,
    metrics: { detected: 89, blocked: 78 }
  }
]

export function SecurityModules() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Active Detection Modules</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time security systems protecting the ecosystem
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            4 Active
          </Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {modules.map((module) => (
            <div
              key={module.title}
              className="p-4 rounded-lg border border-border bg-secondary/50 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="outline" className="text-primary border-primary">
                  {module.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-1">{module.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </div>

              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Detected: </span>
                  <span className="font-mono font-semibold">{module.metrics.detected}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Blocked: </span>
                  <span className="font-mono font-semibold text-primary">{module.metrics.blocked}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
