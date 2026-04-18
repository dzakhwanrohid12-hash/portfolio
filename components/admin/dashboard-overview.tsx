"use client"

import { motion } from "framer-motion"
import { FolderKanban, MessageSquare, Wrench, TrendingUp } from "lucide-react"

interface DashboardOverviewProps {
  projectsCount: number
  messagesCount: number
  skillsCount: number
}

export function DashboardOverview({ projectsCount, messagesCount, skillsCount }: DashboardOverviewProps) {
  const stats = [
    {
      label: "Total Projects",
      value: projectsCount,
      icon: FolderKanban,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      label: "Unread Messages",
      value: messagesCount,
      icon: MessageSquare,
      color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      label: "Skills Listed",
      value: skillsCount,
      icon: Wrench,
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      label: "Growth",
      value: "+12%",
      icon: TrendingUp,
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back! Here&apos;s an overview of your portfolio.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="p-6 rounded-2xl border border-border bg-card"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-heading font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="p-6 rounded-2xl border border-border bg-card"
      >
        <h2 className="text-xl font-heading font-semibold mb-4">Quick Tips</h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-foreground">1.</span>
            Update your profile information to keep your portfolio current.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-foreground">2.</span>
            Add new projects regularly to showcase your latest work.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-foreground">3.</span>
            Check your messages to respond to potential clients.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-foreground">4.</span>
            Keep your skills list updated with your current expertise.
          </li>
        </ul>
      </motion.div>
    </div>
  )
}
