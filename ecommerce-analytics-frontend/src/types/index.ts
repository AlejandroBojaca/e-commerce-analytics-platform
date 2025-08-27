export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  lastActive: Date
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  imageUrl?: string
  description?: string
}

export interface Order {
  id: string
  userId: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'delivered'
  items: OrderItem[]
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  product: Product
  quantity: number
  priceAtTime: number
}

export interface UserActivityEvent {
  id: string
  userId: string
  sessionId: string
  eventType: 'page_view' | 'product_click' | 'search' | 'add_to_cart' | 'checkout_start'
  timestamp: Date
  metadata: Record<string, any>
}

export interface MetricData {
  liveUsers: number
  totalOrders: number
  revenue: number
  conversionRate: number
  averageOrderValue: number
}

export interface SalesData {
  timestamp: string
  sales: number
  orders: number
  category?: string
}

export interface InventoryAlert {
  id: string
  productId: string
  productName: string
  currentStock: number
  threshold: number
  severity: 'low' | 'critical'
  createdAt: Date
}

// WebSocket message types
export interface WSMessage {
  type: 'metric_update' | 'new_order' | 'user_activity' | 'inventory_alert'
  payload: any
  timestamp: Date
}
