'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertTriangle, CheckCircle, XCircle, Search, FileCode } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface VulnerabilityCheck {
  name: string
  status: 'pass' | 'warning' | 'fail'
  description: string
}

interface ScanResult {
  contractAddress: string
  overallScore: number
  vulnerabilities: VulnerabilityCheck[]
  scanTime: Date
}

interface ContractScannerProps {
  tokenAddress?: string
  tokenSymbol?: string
}

export function ContractScanner({ tokenAddress: propTokenAddress, tokenSymbol: propTokenSymbol }: ContractScannerProps = {}) {
  const [contractAddress, setContractAddress] = useState(propTokenAddress || '')
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (propTokenAddress) {
      setContractAddress(propTokenAddress)
      performScan(propTokenAddress)
    }
  }, [propTokenAddress])

  const performScan = async (address?: string) => {
    const scanAddress = address || contractAddress
    if (!scanAddress) return
    
    setScanning(true)
    setScanProgress(0)
    setScanResult(null)
    
    try {
      const response = await fetch(`/api/contract-audit?address=${scanAddress}`)
      
      if (!response.ok) {
        throw new Error('Failed to audit contract')
      }

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 15, 95))
      }, 200)

      const data = await response.json()
      
      clearInterval(progressInterval)
      setScanProgress(100)

      setScanResult({
        contractAddress: data.contractAddress,
        overallScore: data.overallScore,
        vulnerabilities: data.vulnerabilities,
        scanTime: new Date(data.scanTime)
      })
    } catch (error) {
      console.error('[v0] Scan error:', error)
      alert('Failed to scan contract. Please try again.')
    } finally {
      setScanning(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500 text-white">Safe</Badge>
    if (score >= 60) return <Badge className="bg-yellow-500 text-white">Caution</Badge>
    return <Badge className="bg-red-500 text-white">High Risk</Badge>
  }

  return (
    <div className="space-y-6">
      {!propTokenAddress && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileCode className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle>Smart Contract Audit Scanner</CardTitle>
                <CardDescription>
                  Automated vulnerability detection for Solana smart contracts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter contract address..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                disabled={scanning}
                className="flex-1"
              />
              <Button onClick={() => performScan()} disabled={!contractAddress || scanning}>
                <Search className="h-4 w-4 mr-2" />
                {scanning ? 'Scanning...' : 'Scan Contract'}
              </Button>
            </div>

            {scanning && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Analyzing smart contract...</span>
                  <span className="font-medium">{Math.round(scanProgress)}%</span>
                </div>
                <Progress value={scanProgress} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {propTokenAddress && scanning && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Analyzing smart contract for ${propTokenSymbol}...</span>
            <span className="font-medium">{Math.round(scanProgress)}%</span>
          </div>
          <Progress value={scanProgress} />
        </div>
      )}

      {scanResult && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit Results</CardTitle>
              <CardDescription className="font-mono text-xs break-all">
                {scanResult.contractAddress}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Security Score</p>
                  <div className="flex items-center gap-3">
                    <p className={`text-4xl font-bold ${getScoreColor(scanResult.overallScore)}`}>
                      {scanResult.overallScore}/100
                    </p>
                    {getScoreBadge(scanResult.overallScore)}
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Scanned at</p>
                  <p>{scanResult.scanTime.toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanResult.vulnerabilities.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="mt-0.5">
                      {getStatusIcon(check.status)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">{check.name}</p>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Real-Time Monitoring</p>
                  <p className="text-sm text-muted-foreground">
                    This contract will be added to your monitoring list. You'll receive instant alerts 
                    if any suspicious changes are detected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
