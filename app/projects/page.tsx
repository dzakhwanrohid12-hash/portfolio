import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProjectsContent } from "@/components/projects-content"

export const metadata: Metadata = {
  title: "Projects | Portfolio",
  description: "Browse through my collection of design and development projects.",
}

export const revalidate = 60

export default async function ProjectsPage() {
  const supabase = await createClient()

  const [profileResult, projectsResult] = await Promise.all([
    supabase.from("profiles").select("*").limit(1).single(),
    supabase.from("projects").select("*").order("display_order"),
  ])

  const profile = profileResult.data
  const projects = projectsResult.data || []

  return (
    <main className="min-h-screen">
      <Navbar />
      <ProjectsContent projects={projects} />
      <Footer profile={profile} />
    </main>
  )
}
