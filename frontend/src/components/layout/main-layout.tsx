"use client"

import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { NotificationToast } from './notification-toast'
import { useUIStore } from '@/store/ui'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        "lg:ml-64" // Always account for sidebar on large screens
      )}>
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      <NotificationToast />
    </div>
  )
}
