const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
import { MetricData, SalesData, Product, Order, UserActivityEvent, InventoryAlert } from '@/types'

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Metrics endpoints
  async getMetrics(): Promise<MetricData> {
    return this.request<MetricData>('/api/metrics')
  }

  async getSalesData(timeRange: string = '24h'): Promise<SalesData[]> {
    return this.request<SalesData[]>(`/api/sales?range=${timeRange}`)
  }

  // Products endpoints
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products')
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`)
  }

  // Orders endpoints
  async getOrders(page = 1, limit = 20): Promise<{ orders: Order[], total: number }> {
    return this.request<{ orders: Order[], total: number }>(`/api/orders?page=${page}&limit=${limit}`)
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    return this.request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  // User activity
  async getUserActivity(userId?: string): Promise<UserActivityEvent[]> {
    const query = userId ? `?userId=${userId}` : ''
    return this.request<UserActivityEvent[]>(`/api/user-activity${query}`)
  }

  async trackActivity(event: Partial<UserActivityEvent>): Promise<void> {
    return this.request<void>('/api/user-activity', {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }

  // Inventory
  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    return this.request<InventoryAlert[]>('/api/inventory/alerts')
  }
}

export const apiClient = new ApiClient()