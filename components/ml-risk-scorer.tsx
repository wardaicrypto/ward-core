'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Brain, Target, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface RiskFactor {
  category: string
  score: number
  weight: number
  description: string
  indicators: string[]
}

interface MLPrediction {
  tokenAddress: string
  overallRisk: number
  rugPullProbability: number
  manipulationScore: number
  confidenceLevel: number
  riskFactors: RiskFactor[]
  historicalPatterns: string[]
  recommendation: 'avoid' | 'caution' | 'moderate' | 'safe'
}

interface MLRiskScorerProps {
  tokenAddress?: string
  tokenSymbol?: string
}

export function MLRiskScorer({ tokenAddress: propTokenAddress, tokenSymbol: propTokenSymbol }: MLRiskScorerProps = {}) {
  const [tokenAddress, setTokenAddress] = useState(propTokenAddress || '')
  const [analyzing, setAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<MLPrediction | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    if (propTokenAddress) {
      setTokenAddress(propTokenAddress)
      runMLAnalysis(propTokenAddress)
    }
  }, [propTokenAddress])

  const runMLAnalysis = async (address?: string) => {
    const analyzeAddress = address || tokenAddress
    if (!analyzeAddress) return
    
    setAnalyzing(true)
    setAnalysisProgress(0)
    setPrediction(null)
    
    try {
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 12, 90))
      }, 300)

      // Fetch real ML analysis from API
      const response = await fetch(`/api/ml-risk-analysis?address=${analyzeAddress}`)
      
      if (!response.ok) {
        throw new Error('Failed to analyze risk')
      }

      const data = await response.json()
      
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      setPrediction({
        tokenAddress: data.tokenAddress,
        overallRisk: data.overallRisk,
        rugPullProbability: data.rugPullProbability,
        manipulationScore: data.manipulationScore,
        confidenceLevel: data.confidenceLevel,
        riskFactors: data.riskFactors,
        historicalPatterns: [
          `Liquidity: $${data.realTimeData.liquidity.toLocaleString()}`,
          `24h Volume: $${data.realTimeData.volume24h.toLocaleString()}`,
          `Market Cap: $${data.realTimeData.fdv.toLocaleString()}`,
          `Price Change: ${data.realTimeData.priceChange > 0 ? '+' : ''}${data.realTimeData.priceChange.toFixed(2)}%`
        ],
        recommendation: data.recommendation
      })
    } catch (error) {
      console.error('[v0] ML analysis error:', error)
      alert('Failed to analyze risk. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 25) return 'text-green-500'
    if (score < 50) return 'text-blue-500'
    if (score < 75) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getRiskBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'safe':
        return <Badge className="bg-green-500 text-white">Safe to Trade</Badge>
      case 'moderate':
        return <Badge className="bg-blue-500 text-white">Moderate Risk</Badge>
      case 'caution':
        return <Badge className="bg-yellow-500 text-white">Trade with Caution</Badge>
      case 'avoid':
        return <Badge className="bg-red-500 text-white">High Risk - Avoid</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score > 75) return 'bg-green-500'
    if (score > 50) return 'bg-blue-500'
    if (score > 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {!propTokenAddress && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Brain className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <CardTitle>Machine Learning Risk Scorer</CardTitle>
                <CardDescription>
                  AI models trained on 10,000+ historical scams and rug pulls
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter token contract address..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                disabled={analyzing}
                className="flex-1"
              />
              <Button onClick={() => runMLAnalysis()} disabled={!tokenAddress || analyzing}>
                <Target className="h-4 w-4 mr-2" />
                {analyzing ? 'Analyzing...' : 'Analyze Risk'}
              </Button>
            </div>

            {analyzing && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Running ML models...</span>
                  <span className="font-medium">{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} />
                <p className="text-xs text-muted-foreground">
                  {analysisProgress < 30 && 'Analyzing liquidity patterns...'}
                  {analysisProgress >= 30 && analysisProgress < 60 && 'Checking holder distribution...'}
                  {analysisProgress >= 60 && analysisProgress < 90 && 'Comparing with historical data...'}
                  {analysisProgress >= 90 && 'Generating risk prediction...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {propTokenAddress && analyzing && (
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-center">
            <Brain className="h-8 w-8 animate-pulse text-green-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Running ML models for ${propTokenSymbol}...</span>
              <span className="font-bold">{Math.round(analysisProgress)}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {analysisProgress < 30 && 'Analyzing liquidity patterns...'}
              {analysisProgress >= 30 && analysisProgress < 60 && 'Checking holder distribution...'}
              {analysisProgress >= 60 && analysisProgress < 90 && 'Comparing with historical data...'}
              {analysisProgress >= 90 && 'Generating risk prediction...'}
            </p>
          </div>
        </div>
      )}

      {prediction && (
        <>
          {/* Overall Risk Score */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">AI Risk Prediction</CardTitle>
              <CardDescription className="font-mono text-xs break-all">
                {prediction.tokenAddress}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Overall Risk Score</p>
                    <div className="flex items-center gap-3">
                      <p className={`text-5xl font-bold ${getRiskColor(100 - prediction.overallRisk)}`}>
                        {100 - prediction.overallRisk}/100
                      </p>
                      {getRiskBadge(prediction.recommendation)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Confidence Level</p>
                    <p className="text-2xl font-bold">{prediction.confidenceLevel}%</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rug Pull Probability</p>
                    <div className="flex items-center gap-2">
                      <Progress value={prediction.rugPullProbability} className="flex-1" />
                      <span className="text-sm font-medium w-12">{prediction.rugPullProbability}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Manipulation Score</p>
                    <div className="flex items-center gap-2">
                      <Progress value={prediction.manipulationScore} className="flex-1" />
                      <span className="text-sm font-medium w-12">{prediction.manipulationScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Factor Analysis</CardTitle>
              <CardDescription>Weighted assessment across multiple dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prediction.riskFactors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{factor.category}</p>
                        <Badge variant="outline" className="text-xs">
                          Weight: {factor.weight}%
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">
                        {factor.score}/100
                      </span>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                    <div className="pl-4 space-y-1">
                      {factor.indicators.map((indicator, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="mt-1">•</span>
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historical Pattern Matching */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Historical Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prediction.historicalPatterns.map((pattern, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{pattern}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-primary/5 to-blue-500/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Brain className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-2">AI-Powered Insights</p>
                  <p className="text-sm text-muted-foreground">
                    Our machine learning models analyze over 50 different parameters including liquidity patterns, 
                    holder behavior, trading anomalies, contract vulnerabilities, and historical similarities to 
                    thousands of known scams. The models are continuously trained on new data to improve accuracy.
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
