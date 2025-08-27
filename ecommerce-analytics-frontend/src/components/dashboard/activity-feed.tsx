"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDashboardStore } from '@/store/dashboard'
import { UserActivityEvent } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { 
  Eye, 
  MousePointer, 
  Search, 
  ShoppingCart, 
  CreditCard,
  User
} from 'lucide-react'

const activityIcons = {
  page_view: Eye,
  product_click: MousePointer,
  search: Search,
  add_to_cart: ShoppingCart,
  checkout_start: CreditCard
}

const activityColors = {
  page_view: 'text-blue-600',
  product_click: 'text-green-600',
  search: 'text-purple-600',
  add_to_cart: 'text-orange-600',
  checkout_start: 'text-red-600'
}

const activityLabels = {
  page_view: 'Page View',
  product_click: 'Product Click',
  search: 'Search',
  add_to_cart: 'Added to Cart',
  checkout_start: 'Started Checkout'
}

interface ActivityFeedProps {
  className?: string
  maxItems?: number
}

export function ActivityFeed({ className, maxItems = 10 }: ActivityFeedProps) {
  const { recentActivity } = useDashboardStore()

  const displayedActivity = recentActivity.slice(0, maxItems)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Live Activity</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {displayedActivity.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedActivity.map((activity, index) => {
              const Icon = activityIcons[activity.eventType]
              const colorClass = activityColors[activity.eventType]
              const label = activityLabels[activity.eventType]
              
              return (
                <div key={`${activity.id}-${index}`} className="flex items-start space-x-3 pb-3 border-b border-border last:border-b-0">
                  <div className={`p-1 rounded-full bg-muted ${colorClass}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-sm mt-1">
                      User {activity.userId.slice(-6)} {activity.eventType === 'search' ? 
                        `searched for "${activity.metadata?.query}"` :
                        activity.eventType === 'product_click' ?
                        `clicked on ${activity.metadata?.productName}` :
                        activity.eventType === 'page_view' ?
                        `viewed ${activity.metadata?.page}` :
                        activity.eventType === 'add_to_cart' ?
                        `added ${activity.metadata?.productName} to cart` :
                        'started checkout process'
                      }
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}