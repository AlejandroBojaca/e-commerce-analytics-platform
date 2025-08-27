"use client"

import { useDemoData } from '@/hooks/useDemoData'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize demo data
  useDemoData()

  return <>{children}</>
}
