'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, AlertCircle, Info, Shield, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  message: string
  token?: string
  tokenAddress?: string
  tokenName?: string
  time: string
}

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    className: 'bg-destructive/10 border-destructive text-destructive-foreground'
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-warning/10 border-warning text-white'
  },
  info: {
    icon: Info,
    className: 'bg-chart-4/10 border-chart-4 text-foreground'
  },
  success: {
    icon: Shield,
    className: 'bg-primary/10 border-primary text-white'
  }
}

export function LiveAlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [seenAlertIds, setSeenAlertIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAlerts = localStorage.getItem('ward-ai-alerts')
      const savedSeenIds = localStorage.getItem('ward-ai-seen-alerts')
      
      if (savedAlerts) {
        try {
          const parsed = JSON.parse(savedAlerts)
          setAlerts(parsed)
          console.log('[v0] Loaded', parsed.length, 'alerts from localStorage')
        } catch (error) {
          console.error('[v0] Failed to parse saved alerts:', error)
        }
      }
      
      if (savedSeenIds) {
        try {
          const parsed = JSON.parse(savedSeenIds)
          setSeenAlertIds(new Set(parsed))
          console.log('[v0] Loaded', parsed.length, 'seen alert IDs from localStorage')
        } catch (error) {
          console.error('[v0] Failed to parse seen alert IDs:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        console.log('[v0] Fetching live alerts...')
        const response = await fetch('/api/live-alerts')
        const data = await response.json()
        
        console.log('[v0] Received alerts:', data.alerts?.length || 0)
        
        if (data.alerts && data.alerts.length > 0) {
          const newAlerts = data.alerts.filter((alert: Alert) => {
            const alertKey = `${alert.message}-${alert.tokenAddress || alert.token}`
            if (seenAlertIds.has(alertKey)) {
              return false
            }
            return true
          })
          
          if (newAlerts.length > 0) {
            console.log('[v0] Adding new alerts:', newAlerts.length)
            
            setSeenAlertIds(prev => {
              const updated = new Set(prev)
              newAlerts.forEach((alert: Alert) => {
                const alertKey = `${alert.message}-${alert.tokenAddress || alert.token}`
                updated.add(alertKey)
              })
              
              // Save to localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem('ward-ai-seen-alerts', JSON.stringify([...updated]))
              }
              
              return updated
            })
            
            setAlerts(prev => {
              const updated = [...newAlerts, ...prev].slice(0, 20)
              
              // Save to localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem('ward-ai-alerts', JSON.stringify(updated))
              }
              
              return updated
            })
          }
        }
      } catch (error) {
        console.error('[v0] Failed to fetch alerts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
    
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [seenAlertIds])

  return (
    <Card className="p-6 bg-card border-border h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold">Live System Alerts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered real-time security monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No alerts yet. Monitoring active tokens...
          </div>
        ) : (
          <div className="space-y-3 pr-4">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type]
              const Icon = config.icon

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${config.className} animate-in fade-in slide-in-from-top-2 duration-300`}
                >
                  <div className="flex gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className="text-sm leading-relaxed break-words">{alert.message}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {alert.tokenName && (
                          <Badge variant="outline" className="text-xs">
                            ${alert.tokenName}
                          </Badge>
                        )}
                        {alert.token && alert.tokenAddress && (
                          <a
                            href={`https://solscan.io/token/${alert.tokenAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:bg-accent px-2 py-1 rounded-md transition-colors"
                          >
                            <Badge variant="outline" className="text-xs font-mono">
                              {alert.token}
                            </Badge>
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          </a>
                        )}
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
