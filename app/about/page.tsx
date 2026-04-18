import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about-content"

export const metadata: Metadata = {
  title: "About Me | Portfolio",
  description: "Learn more about my journey as a designer and developer.",
}

export const revalidate = 60

export default async function AboutPage() {
  const supabase = await createClient()

  const [profileResult, statsResult, skillsResult] = await Promise.all([
    supabase.from("profiles").select("*").limit(1).single(),
    supabase.from("stats").select("*").order("display_order"),
    supabase.from("skills").select("*").order("display_order"),
  ])

  const profile = profileResult.data
  const stats = statsResult.data || []
  const skills = skillsResult.data || []

  return (
    <main className="min-h-screen">
      <Navbar />
      <AboutContent profile={profile} stats={stats} skills={skills} />
      <Footer profile={profile} />
    </main>
  )
}
