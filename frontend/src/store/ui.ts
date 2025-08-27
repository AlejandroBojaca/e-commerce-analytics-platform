import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Notification[]
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  duration?: number
}

export const useUIStore = create<UIState>()(
  devtools((set) => ({
    sidebarOpen: true,
    theme: 'system',
    notifications: [],

    setSidebarOpen: (sidebarOpen) => 
      set({ sidebarOpen }, false, 'setSidebarOpen'),
    
    toggleSidebar: () => 
      set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
    
    setTheme: (theme) => set({ theme }, false, 'setTheme'),
    
    addNotification: (notification) =>
      set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date()
          },
          ...state.notifications
        ]
      }), false, 'addNotification'),
    
    removeNotification: (id) =>
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }), false, 'removeNotification'),
    
    clearNotifications: () => 
      set({ notifications: [] }, false, 'clearNotifications'),
  }), { name: 'ui-store' })
)
