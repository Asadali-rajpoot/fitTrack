"use client"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"


export default function AppHeader({ title, action }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        {action && (
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1" onClick={action.onClick}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block">{action.label}</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
