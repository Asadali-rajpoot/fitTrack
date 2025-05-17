"use client"

import React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/dashboard/layout/app-sidebar"
import AppHeader from "@/components/dashboard/layout/app-header"


export default function AppLayout({ children, title, action }) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-gradient-to-br from-background to-background/90">
        <AppSidebar />
        <div className="flex w-full flex-1 flex-col">
          <AppHeader title={title} action={action} />
          <main className="flex-1 w-full overflow-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
