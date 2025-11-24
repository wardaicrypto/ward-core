import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-10 w-40" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </main>
    </div>
  )
}
