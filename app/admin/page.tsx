import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!adminUser) {
    redirect("/admin/login")
  }

  // Fetch all data for dashboard
  const [profileResult, statsResult, skillsResult, projectsResult, messagesResult] = await Promise.all([
    supabase.from("profiles").select("*").limit(1).single(),
    supabase.from("stats").select("*").order("display_order"),
    supabase.from("skills").select("*").order("display_order"),
    supabase.from("projects").select("*").order("display_order"),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
  ])

  return (
    <AdminDashboard
      profile={profileResult.data}
      stats={statsResult.data || []}
      skills={skillsResult.data || []}
      projects={projectsResult.data || []}
      messages={messagesResult.data || []}
      userEmail={user.email || ""}
    />
  )
}
