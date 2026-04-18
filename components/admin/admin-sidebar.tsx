"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  User, 
  FolderKanban, 
  Wrench, 
  BarChart3, 
  MessageSquare,
  LogOut,
  Home
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userEmail: string
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "messages", label: "Messages", icon: MessageSquare },
]

export function AdminSidebar({ activeTab, setActiveTab, userEmail }: AdminSidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading font-bold">PORTFOLIO.</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id
                    ? "bg-foreground text-background"
                    : "hover:bg-secondary"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userEmail}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
