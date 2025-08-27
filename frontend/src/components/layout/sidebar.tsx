"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/ui'
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings,
  Menu,
  X,
  Activity,
  AlertTriangle
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Real-time analytics'
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    description: 'Product catalog'
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: ShoppingBag,
    description: 'Order management'
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
    description: 'User analytics'
  },
  {
    name: 'Activity',
    href: '/activity',
    icon: Activity,
    description: 'Live user activity'
  },
  {
    name: 'Alerts',
    href: '/alerts',
    icon: AlertTriangle,
    description: 'System alerts'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application settings'
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Analytics</h1>
                <p className="text-xs text-muted-foreground">E-commerce Dashboard</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className={cn(
                      "text-xs",
                      isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>Real-time Analytics Platform</p>
              <p>Built with Next.js & Kafka</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}