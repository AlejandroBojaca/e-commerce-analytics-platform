"use client"

import { MainLayout } from '@/components/layout/main-layout'
import { MetricCard } from '@/components/dashboard/metric-card'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { InventoryAlerts } from '@/components/dashboard/inventory-alerts'
import { useDashboardStore } from '@/store/dashboard'
import { useDemoData } from '@/hooks/useDemoData'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Package,
  AlertTriangle
} from 'lucide-react'

export default function DashboardPage() {
  const { metrics, salesData, inventoryAlerts } = useDashboardStore()
  const isLoading = false //Change to   const { isLoading } = useDemoData()

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Live Users"
            value={metrics?.liveUsers || 0}
            format="number"
            icon={Users}
            description="Currently active"
            loading={isLoading}
          />
          
          <MetricCard
            title="Total Orders"
            value={metrics?.totalOrders || 0}
            format="number"
            icon={ShoppingCart}
            description="Today's orders"
            loading={isLoading}
          />
          
          <MetricCard
            title="Revenue"
            value={metrics?.revenue || 0}
            format="currency"
            icon={DollarSign}
            description="Today's revenue"
            loading={isLoading}
          />
          
          <MetricCard
            title="Conversion Rate"
            value={metrics?.conversionRate || 0}
            format="percentage"
            icon={TrendingUp}
            description="Visitor to customer"
            loading={isLoading}
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesChart 
              data={salesData} 
              loading={isLoading}
            />
          </div>
          
          <div className="space-y-6">
            <ActivityFeed maxItems={8} />
          </div>
        </div>

        {/* Inventory and Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryAlerts />
          
          {/* Additional metrics could go here */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Products"
              value={245}
              format="number"
              icon={Package}
              description="In catalog"
              loading={isLoading}
            />
            
            <MetricCard
              title="Low Stock"
              value={inventoryAlerts.filter(a => a.severity === 'critical').length}
              format="number"
              icon={AlertTriangle}
              description="Need attention"
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}