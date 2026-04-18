"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Menu, 
  X, 
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

interface AdminMobileNavProps {
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

export function AdminMobileNav({ activeTab, setActiveTab, userEmail }: AdminMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-heading font-bold">
          PORTFOLIO.
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background pt-16"
          >
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    activeTab === item.id
                      ? "bg-foreground text-background"
                      : "hover:bg-secondary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </motion.button>
              ))}

              <div className="pt-4 border-t border-border mt-4 space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  View Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>

              <div className="pt-4 text-center text-sm text-muted-foreground">
                Logged in as {userEmail}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
