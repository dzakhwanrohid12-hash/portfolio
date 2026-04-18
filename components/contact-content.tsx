"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Mail, Phone, Send, Instagram, Linkedin, Dribbble, Github, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/lib/types"

interface ContactContentProps {
  profile: Profile | null
}

export function ContactContent({ profile }: ContactContentProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const supabase = createClient()

    const { error: submitError } = await supabase
      .from("contact_messages")
      .insert([formData])

    setIsSubmitting(false)

    if (submitError) {
      setError("Failed to send message. Please try again.")
      return
    }

    setIsSuccess(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  const socialLinks = [
    { href: profile?.instagram || "#", label: "Instagram", icon: Instagram },
    { href: profile?.dribbble || "#", label: "Dribbble", icon: Dribbble },
    { href: profile?.linkedin || "#", label: "LinkedIn", icon: Linkedin },
    { href: profile?.github || "#", label: "GitHub", icon: Github },
  ]

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mb-16"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6">
            LET&apos;S WORK
            <br />
            TOGETHER
          </h1>
          <p className="text-xl text-muted-foreground">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 border border-border rounded-3xl text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
                <h2 className="text-2xl font-heading font-bold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    placeholder="Project inquiry"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-full bg-foreground text-background font-medium flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-12"
          >
            {/* Info Cards */}
            <div className="space-y-4">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-4 p-6 border border-border rounded-2xl hover:border-foreground/20 transition-colors group"
                >
                  <div className="p-4 rounded-full bg-secondary group-hover:bg-foreground group-hover:text-background transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{profile.email}</div>
                  </div>
                </a>
              )}

              {profile?.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-4 p-6 border border-border rounded-2xl hover:border-foreground/20 transition-colors group"
                >
                  <div className="p-4 rounded-full bg-secondary group-hover:bg-foreground group-hover:text-background transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">{profile.phone}</div>
                  </div>
                </a>
              )}

              {profile?.location && (
                <div className="flex items-center gap-4 p-6 border border-border rounded-2xl">
                  <div className="p-4 rounded-full bg-secondary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">{profile.location}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                Follow Me
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-full hover:bg-secondary transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
