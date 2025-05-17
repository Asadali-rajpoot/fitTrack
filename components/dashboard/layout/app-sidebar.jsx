"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  BarChart3,
  Calendar,
  Dumbbell,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Router,
  Settings,
  Trophy,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authAPI } from "@/lib/api"

export default function AppSidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const router = useRouter()

  // Fetch current user when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authAPI.getCurrentUser()
        setUser(response)
      } catch (err) {
        console.error("Failed to fetch user:", err)
        setError("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
      router.push("/auth/login")
    } catch (err) {
      console.error("Failed to logout:", err)
      setError("Failed to logout")
    }
  }

  const isActive = (path) => {
    return pathname === path
  }

  // Get initials for AvatarFallback
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="flex h-14 items-center border-b border-border/40 px-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="text-foreground">FIT</span>
          <span className="text-primary">TRACK</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/members")} tooltip="Members">
                  <Link href="/dashboard/members">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/classes")} tooltip="Classes">
                  <Link href="/dashboard/classes">
                    <Calendar className="h-4 w-4" />
                    <span>Classes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/trainers")} tooltip="Trainers">
                  <Link href="/dashboard/trainers">
                    <Trophy className="h-4 w-4" />
                    <span>Trainers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/analytics")} tooltip="Analytics">
                  <Link href="/dashboard/analytics">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/messages")} tooltip="Messages">
                  <Link href="/dashboard/messages">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                    <Badge className="ml-auto bg-primary text-primary-foreground">5</Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")} tooltip="Settings">
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>...</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>!</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Error</span>
              <span className="text-xs text-destructive">{error}</span>
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.role}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Guest</span>
              <span className="text-xs text-muted-foreground">Not logged in</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}