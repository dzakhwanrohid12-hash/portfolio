"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminMobileNav } from "./admin-mobile-nav"
import { DashboardOverview } from "./dashboard-overview"
import { ProfileManager } from "./profile-manager"
import { ProjectsManager } from "./projects-manager"
import { SkillsManager } from "./skills-manager"
import { StatsManager } from "./stats-manager"
import { MessagesManager } from "./messages-manager"
import type { Profile, Stat, Skill, Project, ContactMessage } from "@/lib/types"

interface AdminDashboardProps {
  profile: Profile | null
  stats: Stat[]
  skills: Skill[]
  projects: Project[]
  messages: ContactMessage[]
  userEmail: string
}

export function AdminDashboard({
  profile,
  stats,
  skills,
  projects,
  messages,
  userEmail,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview 
          projectsCount={projects.length} 
          messagesCount={messages.filter(m => !m.is_read).length}
          skillsCount={skills.length}
        />
      case "profile":
        return <ProfileManager profile={profile} />
      case "projects":
        return <ProjectsManager projects={projects} />
      case "skills":
        return <SkillsManager skills={skills} profileId={profile?.id} />
      case "stats":
        return <StatsManager stats={stats} profileId={profile?.id} />
      case "messages":
        return <MessagesManager messages={messages} />
      default:
        return <DashboardOverview 
          projectsCount={projects.length} 
          messagesCount={messages.filter(m => !m.is_read).length}
          skillsCount={skills.length}
        />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Navigation */}
      <AdminMobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        userEmail={userEmail}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            userEmail={userEmail}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
