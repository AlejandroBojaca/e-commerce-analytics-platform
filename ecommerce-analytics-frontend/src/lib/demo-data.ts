import { MetricData, SalesData, UserActivityEvent, InventoryAlert } from '@/types'

export class DemoDataGenerator {
  private intervalId: NodeJS.Timeout | null = null
  private callbacks: Array<(data: any) => void> = []

  // Generate realistic metrics
  generateMetrics(): MetricData {
    const baseUsers = 150
    const userVariation = Math.floor(Math.random() * 50) - 25
    
    const baseOrders = 85
    const orderVariation = Math.floor(Math.random() * 20) - 10
    
    const baseRevenue = 12500
    const revenueVariation = Math.random() * 2000 - 1000
    
    return {
      liveUsers: Math.max(0, baseUsers + userVariation),
      totalOrders: Math.max(0, baseOrders + orderVariation),
      revenue: Math.max(0, baseRevenue + revenueVariation),
      conversionRate: 0.025 + (Math.random() * 0.02 - 0.01), // 2.5% ± 1%
      averageOrderValue: 147.5 + (Math.random() * 40 - 20)
    }
  }

  // Generate sales data points
  generateSalesDataPoint(): SalesData {
    const sales = Math.random() * 500 + 100
    const orders = Math.floor(Math.random() * 5) + 1
    const categories = ['Electronics', 'Clothing', 'Fitness', 'Accessories', 'Home']
    
    return {
      timestamp: new Date().toISOString(),
      sales,
      orders,
      category: categories[Math.floor(Math.random() * categories.length)]
    }
  }

  // Generate user activity events
  generateUserActivity(): UserActivityEvent {
    const eventTypes = ['page_view', 'product_click', 'search', 'add_to_cart', 'checkout_start'] as const
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    const userId = `user_${Math.random().toString(36).substr(2, 8)}`
    const sessionId = `session_${Math.random().toString(36).substr(2, 10)}`
    
    const metadata: Record<string, any> = {}
    
    switch (eventType) {
      case 'search':
        const searchQueries = ['headphones', 'laptop', 't-shirt', 'water bottle', 'gaming mouse']
        metadata.query = searchQueries[Math.floor(Math.random() * searchQueries.length)]
        break
      case 'product_click':
      case 'add_to_cart':
        const productNames = ['Wireless Headphones', 'Gaming Laptop', 'Cotton T-Shirt', 'Smart Watch', 'Bluetooth Speaker']
        metadata.productName = productNames[Math.floor(Math.random() * productNames.length)]
        metadata.productId = `prod_${Math.random().toString(36).substr(2, 6)}`
        break
      case 'page_view':
        const pages = ['Home', 'Products', 'Category/Electronics', 'Cart', 'Checkout']
        metadata.page = pages[Math.floor(Math.random() * pages.length)]
        break
    }
    
    return {
      id: `activity_${Math.random().toString(36).substr(2, 10)}`,
      userId,
      sessionId,
      eventType,
      timestamp: new Date(),
      metadata
    }
  }

  // Generate inventory alerts
  generateInventoryAlert(): InventoryAlert {
    const products = [
      'Wireless Bluetooth Headphones',
      'Gaming Mouse',
      'Smart Water Bottle',
      'Premium Laptop Stand',
      'Wireless Keyboard'
    ]
    
    const productName = products[Math.floor(Math.random() * products.length)]
    const currentStock = Math.floor(Math.random() * 10) + 1
    const threshold = 20
    const severity = currentStock <= 3 ? 'critical' : 'low'
    
    return {
      id: `alert_${Math.random().toString(36).substr(2, 10)}`,
      productId: `prod_${Math.random().toString(36).substr(2, 6)}`,
      productName,
      currentStock,
      threshold,
      severity,
      createdAt: new Date()
    }
  }

  // Start generating demo data
  start(callback: (data: { type: string; payload: any }) => void) {
    this.callbacks.push(callback)
    
    if (this.intervalId) return
    
    // Generate initial data
    callback({
      type: 'metric_update',
      payload: this.generateMetrics()
    })

    // Generate periodic updates
    this.intervalId = setInterval(() => {
      // Metrics update every 10 seconds
      if (Math.random() < 0.3) {
        callback({
          type: 'metric_update',
          payload: this.generateMetrics()
        })
      }

      // Sales data every 5-15 seconds
      if (Math.random() < 0.4) {
        callback({
          type: 'new_order',
          payload: {
            id: `order_${Math.random().toString(36).substr(2, 8)}`,
            totalAmount: Math.random() * 300 + 50,
            category: ['Electronics', 'Clothing', 'Fitness'][Math.floor(Math.random() * 3)]
          }
        })
      }

      // User activity frequently
      if (Math.random() < 0.7) {
        callback({
          type: 'user_activity',
          payload: this.generateUserActivity()
        })
      }

      // Inventory alerts occasionally
      if (Math.random() < 0.1) {
        callback({
          type: 'inventory_alert',
          payload: this.generateInventoryAlert()
        })
      }
    }, 3000) // Run every 3 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.callbacks = []
  }
}
