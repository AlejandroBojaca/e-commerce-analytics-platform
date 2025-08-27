"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUIStore } from '@/store/ui'
import { useDashboardStore } from '@/store/dashboard'
import { useDemoData } from '@/hooks/useDemoData'
import { 
  Menu, 
  Bell, 
  Settings, 
  Wifi, 
  WifiOff,
  RefreshCw
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function Header() {
  const { setSidebarOpen, notifications } = useUIStore()
  const { lastUpdate } = useDashboardStore()
  const { isConnected, isLoading, refetch } = { isConnected: true, isLoading: false, refetch: undefined } // change to const { isConnected, isLoading, refetch } = useDemoData() 

  const unreadNotifications = notifications.filter(n => n.type === 'error' || n.type === 'warning')

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold">Real-time Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Monitor your e-commerce analytics in real-time
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <Badge variant="success" className="text-xs">
                  Connected
                </Badge>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <Badge variant="destructive" className="text-xs">
                  Disconnected
                </Badge>
              </>
            )}
          </div>

          {/* Last Update */}
          {lastUpdate && (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground">
              <span>Last update:</span>
              <span>{formatDistanceToNow(lastUpdate, { addSuffix: true })}</span>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={refetch}
            disabled={isLoading}
            className={isLoading ? 'animate-spin' : ''}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
                >
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}