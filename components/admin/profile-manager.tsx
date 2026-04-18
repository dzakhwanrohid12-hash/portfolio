"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

interface ProfileManagerProps {
  profile: Profile | null
}

export function ProfileManager({ profile }: ProfileManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    title: profile?.title || "",
    tagline: profile?.tagline || "",
    bio: profile?.bio || "",
    established_year: profile?.established_year || 2020,
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    instagram: profile?.instagram || "",
    linkedin: profile?.linkedin || "",
    dribbble: profile?.dribbble || "",
    behance: profile?.behance || "",
    github: profile?.github || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile?.id)

    setIsLoading(false)

    if (error) {
      setMessage("Failed to update profile. Please try again.")
      return
    }

    setMessage("Profile updated successfully!")
    router.refresh()
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-heading font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground mb-8">
          Manage your personal information and social links.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
      >
        {/* Basic Info */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Established Year</label>
            <input
              type="number"
              value={formData.established_year}
              onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h2 className="text-lg font-semibold">Contact Information</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <h2 className="text-lg font-semibold">Social Links</h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dribbble</label>
              <input
                type="url"
                value={formData.dribbble}
                onChange={(e) => setFormData({ ...formData, dribbble: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                placeholder="https://dribbble.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Behance</label>
              <input
                type="url"
                value={formData.behance}
                onChange={(e) => setFormData({ ...formData, behance: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                placeholder="https://behance.net/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>

        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </motion.form>
    </div>
  )
}
