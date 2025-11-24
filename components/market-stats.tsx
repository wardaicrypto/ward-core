'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, Shield, AlertTriangle, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Stats {
  tokensMonitored: number
  threatsDetected: number
  protectedVolume: string
  activeGuards: number
}

export function MarketStats() {
  const [stats, setStats] = useState<Stats>({
    tokensMonitored: 24847,
    threatsDetected: 1293,
    protectedVolume: '$428M',
    activeGuards: 8432
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        tokensMonitored: prev.tokensMonitored + Math.floor(Math.random() * 10),
        threatsDetected: prev.threatsDetected + (Math.random() > 0.7 ? 1 : 0),
        protectedVolume: `$${(parseInt(prev.protectedVolume.replace(/[$M]/g, '')) + Math.random() * 2).toFixed(0)}M`,
        activeGuards: prev.activeGuards + Math.floor(Math.random() * 5 - 2)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const statsList = [
    {
      label: 'Tokens Monitored',
      value: stats.tokensMonitored.toLocaleString(),
      change: '+12.4%',
      icon: Activity,
      trend: 'up'
    },
    {
      label: 'Threats Detected',
      value: stats.threatsDetected.toLocaleString(),
      change: '+8.2%',
      icon: AlertTriangle,
      trend: 'up'
    },
    {
      label: 'Protected Volume',
      value: stats.protectedVolume,
      change: '+24.1%',
      icon: Shield,
      trend: 'up'
    },
    {
      label: 'Active Guards',
      value: stats.activeGuards.toLocaleString(),
      change: '+15.7%',
      icon: TrendingUp,
      trend: 'up'
    }
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsList.map((stat) => (
        <Card key={stat.label} className="p-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-primary">{stat.change} this week</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
