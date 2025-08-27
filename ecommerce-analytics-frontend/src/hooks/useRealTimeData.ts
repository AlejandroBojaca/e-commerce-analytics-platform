import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { useDashboardStore } from '@/store/dashboard'
import { useWebSocket } from './useWebSocket'

export function useRealTimeData() {
  const queryClient = useQueryClient()
  const { timeRange, selectedCategory } = useDashboardStore()
  
  // Establish WebSocket connection
  const { isConnected, sendMessage } = useWebSocket()

  // Initial data fetch
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: apiClient.getMetrics,
    refetchInterval: 30000, // Fallback polling every 30s
    staleTime: 10000
  })

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales', timeRange, selectedCategory],
    queryFn: () => apiClient.getSalesData(timeRange),
    refetchInterval: 60000, // Fallback polling every minute
    staleTime: 30000
  })

  const { data: inventoryAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: apiClient.getInventoryAlerts,
    refetchInterval: 120000, // Fallback polling every 2 minutes
    staleTime: 60000
  })

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['user-activity'],
    queryFn: () => apiClient.getUserActivity(),
    refetchInterval: 30000,
    staleTime: 15000
  })

  // Update store when initial data loads
  useEffect(() => {
    if (metrics) {
      useDashboardStore.getState().setMetrics(metrics)
    }
  }, [metrics])

  useEffect(() => {
    if (salesData) {
      useDashboardStore.getState().setSalesData(salesData)
    }
  }, [salesData])

  useEffect(() => {
    if (inventoryAlerts) {
      useDashboardStore.getState().setInventoryAlerts(inventoryAlerts)
    }
  }, [inventoryAlerts])

  useEffect(() => {
    if (recentActivity) {
      useDashboardStore.getState().setRecentActivity(recentActivity)
    }
  }, [recentActivity])

  // Subscribe to real-time updates when filters change
  useEffect(() => {
    if (isConnected) {
      sendMessage({
        type: 'subscribe',
        payload: {
          timeRange,
          category: selectedCategory
        }
      })
    }
  }, [isConnected, sendMessage, timeRange, selectedCategory])

  return {
    isConnected,
    isLoading: metricsLoading || salesLoading || alertsLoading || activityLoading,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-alerts'] })
      queryClient.invalidateQueries({ queryKey: ['user-activity'] })
    }
  }
}
