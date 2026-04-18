import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact-content"

export const metadata: Metadata = {
  title: "Contact | Portfolio",
  description: "Get in touch with me for collaboration and project inquiries.",
}

export default async function ContactPage() {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single()

  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactContent profile={profile} />
      <Footer profile={profile} />
    </main>
  )
}
