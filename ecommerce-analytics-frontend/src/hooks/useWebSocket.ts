import { useEffect, useRef, useCallback } from 'react'
import { useDashboardStore } from '@/store/dashboard'
import { useUIStore } from '@/store/ui'
import { WSMessage } from '@/types'

interface UseWebSocketOptions {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
    reconnectInterval = 3000,
    maxReconnectAttempts = 10
  } = options

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Store actions
  const {
    setMetrics,
    addSalesDataPoint,
    addInventoryAlert,
    addActivityEvent,
    setConnectionStatus
  } = useDashboardStore()

  const { addNotification } = useUIStore()

  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onopen = () => {
        console.log('WebSocket connected')
        setConnectionStatus(true)
        reconnectAttemptsRef.current = 0
        
        addNotification({
          type: 'success',
          title: 'Connected',
          message: 'Real-time data connection established',
          duration: 3000
        })
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        setConnectionStatus(false)
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          scheduleReconnect()
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          addNotification({
            type: 'error',
            title: 'Connection Failed',
            message: 'Failed to establish real-time connection after multiple attempts',
            duration: 5000
          })
        }
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Real-time connection encountered an error',
          duration: 4000
        })
      }
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      scheduleReconnect()
    }
  }, [url, setConnectionStatus, addNotification, maxReconnectAttempts])

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      reconnectAttemptsRef.current += 1
      
      addNotification({
        type: 'warning',
        title: 'Reconnecting...',
        message: `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
        duration: 3000
      })

      reconnectTimeoutRef.current = setTimeout(() => {
        connect()
      }, reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current - 1)) // Exponential backoff
    }
  }, [connect, reconnectInterval, maxReconnectAttempts, addNotification])

  const handleMessage = useCallback((message: WSMessage) => {
    switch (message.type) {
      case 'metric_update':
        setMetrics(message.payload)
        break

      case 'new_order':
        // Add to sales data
        addSalesDataPoint({
          timestamp: new Date(message.timestamp).toISOString(),
          sales: message.payload.totalAmount,
          orders: 1,
          category: message.payload.category
        })
        
        addNotification({
          type: 'success',
          title: 'New Order',
          message: `Order #${message.payload.id} - $${message.payload.totalAmount}`,
          duration: 4000
        })
        break

      case 'user_activity':
        addActivityEvent(message.payload)
        break

      case 'inventory_alert':
        addInventoryAlert(message.payload)
        
        addNotification({
          type: message.payload.severity === 'critical' ? 'error' : 'warning',
          title: 'Inventory Alert',
          message: `${message.payload.productName} is ${message.payload.severity === 'critical' ? 'critically' : ''} low in stock`,
          duration: 5000
        })
        break

      default:
        console.log('Unknown message type:', message.type)
    }
  }, [setMetrics, addSalesDataPoint, addActivityEvent, addInventoryAlert, addNotification])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnecting')
      wsRef.current = null
    }
    
    setConnectionStatus(false)
  }, [setConnectionStatus])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  // Connect on mount
  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    sendMessage,
    disconnect,
    reconnect: connect
  }
}