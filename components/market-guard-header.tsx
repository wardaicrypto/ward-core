'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function MarketGuardHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Image 
                src="/ward-ai-logo.png" 
                alt="Ward AI Logo" 
                width={40} 
                height={40}
                className="h-10 w-10"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ward AI</h2>
              <p className="text-xs text-muted-foreground">Protecting the decentralized future</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/monitor" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/monitor' ? 'text-primary font-medium' : ''}`}
            >
              Monitor
            </Link>
            <Link 
              href="/analytics" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/analytics' ? 'text-primary font-medium' : ''}`}
            >
              Analytics & AI
            </Link>
            <Link 
              href="/advanced-trading" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/advanced-trading' ? 'text-primary font-medium' : ''}`}
            >
              Advanced Trading
            </Link>
            <Link 
              href="/docs" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/docs' ? 'text-primary font-medium' : ''}`}
            >
              Documentation
            </Link>
          </nav>

          <button
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-border pt-4">
            <Link 
              href="/" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/' ? 'text-primary font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/monitor" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/monitor' ? 'text-primary font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Monitor
            </Link>
            <Link 
              href="/analytics" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/analytics' ? 'text-primary font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics & AI
            </Link>
            <Link 
              href="/advanced-trading" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/advanced-trading' ? 'text-primary font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Advanced Trading
            </Link>
            <Link 
              href="/docs" 
              className={`text-sm hover:text-primary transition-colors ${pathname === '/docs' ? 'text-primary font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default MarketGuardHeader
