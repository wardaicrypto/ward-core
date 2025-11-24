'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const chartData = [
  { time: '00:00', threats: 12, volume: 45 },
  { time: '04:00', threats: 18, volume: 52 },
  { time: '08:00', threats: 35, volume: 78 },
  { time: '12:00', threats: 28, volume: 65 },
  { time: '16:00', threats: 42, volume: 89 },
  { time: '20:00', threats: 31, volume: 71 },
  { time: '24:00', threats: 25, volume: 58 }
]

export function ThreatDetection() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Threat Detection Overview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              24-hour monitoring and analysis
            </p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            Live
          </Badge>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(74 222 128)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="rgb(74 222 128)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="rgb(115 115 115)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgb(115 115 115)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(23 23 23)',
                  border: '1px solid rgb(38 38 38)',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="threats" 
                stroke="rgb(74 222 128)" 
                fillOpacity={1} 
                fill="url(#colorThreats)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Peak Threats</p>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-primary">16:00 UTC</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Avg Response</p>
            <p className="text-2xl font-bold">1.2s</p>
            <p className="text-xs text-primary">Real-time</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">94.7%</p>
            <p className="text-xs text-primary">+2.3%</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
