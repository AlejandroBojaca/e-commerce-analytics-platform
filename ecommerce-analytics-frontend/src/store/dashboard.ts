import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { MetricData, SalesData, InventoryAlert, UserActivityEvent } from '@/types'

interface DashboardState {
  // Real-time metrics
  metrics: MetricData | null
  salesData: SalesData[]
  inventoryAlerts: InventoryAlert[]
  recentActivity: UserActivityEvent[]
  
  // Connection status
  isConnected: boolean
  lastUpdate: Date | null
  
  // Filters and settings
  timeRange: '1h' | '24h' | '7d' | '30d'
  selectedCategory: string | null
  
  // Actions
  setMetrics: (metrics: MetricData) => void
  setSalesData: (data: SalesData[]) => void
  addSalesDataPoint: (dataPoint: SalesData) => void
  setInventoryAlerts: (alerts: InventoryAlert[]) => void
  addInventoryAlert: (alert: InventoryAlert) => void
  setRecentActivity: (activity: UserActivityEvent[]) => void
  addActivityEvent: (event: UserActivityEvent) => void
  setConnectionStatus: (connected: boolean) => void
  setTimeRange: (range: '1h' | '24h' | '7d' | '30d') => void
  setSelectedCategory: (category: string | null) => void
  updateLastUpdate: () => void
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      metrics: null,
      salesData: [],
      inventoryAlerts: [],
      recentActivity: [],
      isConnected: false,
      lastUpdate: null,
      timeRange: '24h',
      selectedCategory: null,

      // Actions
      setMetrics: (metrics) =>
        set({ metrics, lastUpdate: new Date() }, false, 'setMetrics'),

      setSalesData: (salesData) =>
        set({ salesData, lastUpdate: new Date() }, false, 'setSalesData'),

      addSalesDataPoint: (dataPoint) =>
        set((state) => {
          const newData = [...state.salesData, dataPoint]
          // Keep only last 100 data points for performance
          const trimmedData = newData.slice(-100)
          return { salesData: trimmedData, lastUpdate: new Date() }
        }, false, 'addSalesDataPoint'),

      setInventoryAlerts: (inventoryAlerts) =>
        set({ inventoryAlerts, lastUpdate: new Date() }, false, 'setInventoryAlerts'),

      addInventoryAlert: (alert) =>
        set((state) => ({
          inventoryAlerts: [alert, ...state.inventoryAlerts],
          lastUpdate: new Date()
        }), false, 'addInventoryAlert'),

      setRecentActivity: (recentActivity) =>
        set({ recentActivity, lastUpdate: new Date() }, false, 'setRecentActivity'),

      addActivityEvent: (event) =>
        set((state) => {
          const newActivity = [event, ...state.recentActivity]
          // Keep only last 50 activity events
          const trimmedActivity = newActivity.slice(0, 50)
          return { recentActivity: trimmedActivity, lastUpdate: new Date() }
        }, false, 'addActivityEvent'),

      setConnectionStatus: (isConnected) =>
        set({ isConnected }, false, 'setConnectionStatus'),

      setTimeRange: (timeRange) =>
        set({ timeRange }, false, 'setTimeRange'),

      setSelectedCategory: (selectedCategory) =>
        set({ selectedCategory }, false, 'setSelectedCategory'),

      updateLastUpdate: () =>
        set({ lastUpdate: new Date() }, false, 'updateLastUpdate'),
    })),
    { name: 'dashboard-store' }
  )
)
