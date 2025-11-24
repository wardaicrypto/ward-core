"use client"

interface SentimentGaugeProps {
  score: number // -100 to 100
  mlRiskScore?: number // 0-100, optional ML risk score for accuracy
  size?: "sm" | "md" | "lg"
}

export function SentimentGauge({ score, mlRiskScore, size = "md" }: SentimentGaugeProps) {
  let adjustedScore = score
  if (mlRiskScore !== undefined) {
    // If ML risk is high (60+), sentiment should be more bearish
    // If ML risk is low (<30), sentiment can be more bullish
    const riskAdjustment = (mlRiskScore - 50) * 0.8 // Scale -40 to +40
    adjustedScore = Math.max(-100, Math.min(100, score - riskAdjustment))
  }

  // Normalize score to 0-100 range for the gauge
  const normalizedScore = ((adjustedScore + 100) / 2).toFixed(0)
  const rotation = (Number.parseFloat(normalizedScore) / 100) * 180 - 90

  const sizes = {
    sm: { width: 200, height: 120, fontSize: "text-3xl", labelSize: "text-xs" },
    md: { width: 280, height: 160, fontSize: "text-5xl", labelSize: "text-sm" },
    lg: { width: 360, height: 200, fontSize: "text-6xl", labelSize: "text-base" },
  }

  const { width, height, fontSize, labelSize } = sizes[size]

  const getSentimentLabel = () => {
    // If we have ML risk data, use it to make more accurate sentiment classification
    if (mlRiskScore !== undefined) {
      if (mlRiskScore >= 70) return { label: "Bearish", color: "text-red-500" }
      if (mlRiskScore >= 50) return { label: "Neutral", color: "text-yellow-500" }
      if (mlRiskScore >= 30) {
        // Medium-low risk - check sentiment score
        if (adjustedScore > 20) return { label: "Bullish", color: "text-green-500" }
        return { label: "Neutral", color: "text-yellow-500" }
      }
      // Low risk (<30) - more likely bullish
      return { label: "Bullish", color: "text-green-500" }
    }

    // Fallback to sentiment-only classification
    if (adjustedScore > 30) return { label: "Bullish", color: "text-green-500" }
    if (adjustedScore > -30) return { label: "Neutral", color: "text-yellow-500" }
    return { label: "Bearish", color: "text-red-500" }
  }

  const sentiment = getSentimentLabel()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Gauge background arc */}
          <path
            d={`M ${width * 0.1} ${height * 0.9} A ${width * 0.4} ${width * 0.4} 0 0 1 ${width * 0.9} ${height * 0.9}`}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={width * 0.08}
            strokeLinecap="round"
          />

          {/* Colored gauge arc */}
          <path
            d={`M ${width * 0.1} ${height * 0.9} A ${width * 0.4} ${width * 0.4} 0 0 1 ${width * 0.9} ${height * 0.9}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={width * 0.08}
            strokeLinecap="round"
          />

          {/* Needle */}
          <g transform={`translate(${width / 2}, ${height * 0.9})`}>
            <g transform={`rotate(${rotation})`}>
              <polygon
                points={`0,-${width * 0.35} -${width * 0.02},0 ${width * 0.02},0`}
                fill="hsl(var(--foreground))"
              />
            </g>
            {/* Center circle */}
            <circle
              cx="0"
              cy="0"
              r={width * 0.04}
              fill="hsl(var(--background))"
              stroke="hsl(var(--foreground))"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className={`font-bold ${fontSize} ${sentiment.color}`}>
            {Math.round(adjustedScore) > 0 ? "+" : ""}
            {Math.round(adjustedScore)}
          </div>
          <div className={`${labelSize} font-medium ${sentiment.color} mt-1`}>{sentiment.label}</div>
          {mlRiskScore !== undefined && (
            <div className="text-xs text-muted-foreground mt-1">ML Risk: {mlRiskScore}/100</div>
          )}
        </div>

        {/* Labels */}
        <div className={`absolute left-0 bottom-0 ${labelSize} text-muted-foreground`}>Bearish</div>
        <div className={`absolute right-0 bottom-0 ${labelSize} text-muted-foreground`}>Bullish</div>
        <div className={`absolute left-1/2 -translate-x-1/2 top-0 ${labelSize} text-muted-foreground`}>Neutral</div>
      </div>

      <div className="flex gap-6 items-center justify-center flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground">Extreme Bearish</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-muted-foreground">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Extreme Bullish</span>
        </div>
      </div>
    </div>
  )
}
