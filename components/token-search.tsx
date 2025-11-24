'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function TokenSearch() {
  const [query, setQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const handleAnalyze = async () => {
    if (!query.trim()) return
    
    setIsAnalyzing(true)
    
    // Navigate to analysis page with token address
    router.push(`/analyze?token=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze()
    }
  }

  return (
    <div className="relative max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by contract address..."
          className="pl-12 pr-24 h-14 bg-card border-border text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAnalyzing}
        />
        <Button 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !query.trim()}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Enter any Solana token contract address to run AI-powered security analysis
      </p>
    </div>
  )
}
