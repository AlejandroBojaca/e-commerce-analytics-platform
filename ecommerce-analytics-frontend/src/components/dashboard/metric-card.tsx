"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatNumber, formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number
  previousValue?: number
  format?: 'number' | 'currency' | 'percentage'
  icon?: LucideIcon
  description?: string
  className?: string
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  previousValue,
  format = 'number',
  icon: Icon,
  description,
  className,
  loading = false
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return formatPercentage(val)
      default:
        return formatNumber(val)
    }
  }

  const calculateChange = () => {
    if (previousValue === undefined || previousValue === 0) return null
    return ((value - previousValue) / previousValue) * 100
  }

  const change = calculateChange()
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 bg-muted animate-pulse rounded w-20" />
          ) : (
            formatValue(value)
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          
          {change !== null && !loading && (
            <div className="flex items-center space-x-1">
              {isPositive && <TrendingUp className="h-3 w-3 text-green-600" />}
              {isNegative && <TrendingDown className="h-3 w-3 text-red-600" />}
              {change === 0 && <Minus className="h-3 w-3 text-gray-600" />}
              
              <Badge
                variant={isPositive ? 'success' : isNegative ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {Math.abs(change).toFixed(1)}%
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}