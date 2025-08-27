"use client"

import { useEffect, useRef } from 'react'
import { DemoDataGenerator } from '@/lib/demo-data'
import { useDashboardStore } from '@/store/dashboard'
import { useUIStore } from '@/store/ui'

export function useDemoData() {
  const generatorRef = useRef<DemoDataGenerator | null>(null)
  const {
    setMetrics,
    addSalesDataPoint,
    addInventoryAlert,
    addActivityEvent,
    setConnectionStatus
  } = useDashboardStore()
  
  const { addNotification } = useUIStore()

  useEffect(() => {
    // Initialize demo data generator
    generatorRef.current = new DemoDataGenerator()
    
    const handleDemoData = (data: { type: string; payload: any }) => {
      switch (data.type) {
        case 'metric_update':
          setMetrics(data.payload)
          break
          
        case 'new_order':
          addSalesDataPoint({
            timestamp: new Date().toISOString(),
            sales: data.payload.totalAmount,
            orders: 1,
            category: data.payload.category
          })
          
          addNotification({
            type: 'success',
            title: 'New Order',
            message: `Order ${data.payload.id} - ${data.payload.totalAmount.toFixed(2)}`,
            duration: 4000
          })
          break
          
        case 'user_activity':
          addActivityEvent(data.payload)
          break
          
        case 'inventory_alert':
          addInventoryAlert(data.payload)
          
          addNotification({
            type: data.payload.severity === 'critical' ? 'error' : 'warning',
            title: 'Inventory Alert',
            message: `${data.payload.productName} is ${data.payload.severity === 'critical' ? 'critically' : ''} low in stock`,
            duration: 5000
          })
          break
      }
    }

    // Start demo data generation
    generatorRef.current.start(handleDemoData)
    setConnectionStatus(true)

    // Simulate initial loading
    setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Demo Mode Active',
        message: 'Generating realistic demo data for demonstration',
        duration: 5000
      })
    }, 1000)

    // Cleanup on unmount
    return () => {
      if (generatorRef.current) {
        generatorRef.current.stop()
      }
      setConnectionStatus(false)
    }
  }, [setMetrics, addSalesDataPoint, addInventoryAlert, addActivityEvent, setConnectionStatus, addNotification])

  return {
    isGenerating: generatorRef.current !== null
  }
}
