import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ProjectsSection } from "@/components/projects-section"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const [profileResult, statsResult, skillsResult, projectsResult] = await Promise.all([
    supabase.from("profiles").select("*").limit(1).single(),
    supabase.from("stats").select("*").order("display_order"),
    supabase.from("skills").select("*").order("display_order"),
    supabase.from("projects").select("*").eq("featured", true).order("display_order"),
  ])

  const profile = profileResult.data
  const stats = statsResult.data || []
  const skills = skillsResult.data || []
  const projects = projectsResult.data || []

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection profile={profile} skills={skills} />
      <StatsSection profile={profile} stats={stats} />
      <ProjectsSection projects={projects} />
      <ServicesSection skills={skills} />
      <Footer profile={profile} />
    </main>
  )
}
