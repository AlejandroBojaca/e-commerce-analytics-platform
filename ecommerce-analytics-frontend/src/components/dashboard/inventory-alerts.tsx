"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/store/dashboard'
import { AlertTriangle, Package, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface InventoryAlertsProps {
  className?: string
  maxItems?: number
}

export function InventoryAlerts({ className, maxItems = 5 }: InventoryAlertsProps) {
  const { inventoryAlerts } = useDashboardStore()

  const displayedAlerts = inventoryAlerts.slice(0, maxItems)
  const criticalAlerts = displayedAlerts.filter(alert => alert.severity === 'critical')
  const lowAlerts = displayedAlerts.filter(alert => alert.severity === 'low')

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Inventory Alerts</span>
          </div>
          {displayedAlerts.length > 0 && (
            <Badge variant={criticalAlerts.length > 0 ? 'destructive' : 'warning'}>
              {displayedAlerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {displayedAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No inventory alerts</p>
            <p className="text-xs mt-1">All products are well stocked</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                <div className={`p-1 rounded-full ${
                  alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{alert.productName}</h4>
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'warning'}>
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    Stock: {alert.currentStock} / {alert.threshold} threshold
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </span>
                    
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}