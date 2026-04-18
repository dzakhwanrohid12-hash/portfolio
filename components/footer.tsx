"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Instagram, Linkedin, Dribbble, Github } from "lucide-react"
import type { Profile } from "@/lib/types"

interface FooterProps {
  profile: Profile | null
}

export function Footer({ profile }: FooterProps) {
  const socialLinks = [
    { href: profile?.instagram || "#", label: "Instagram", icon: Instagram },
    { href: profile?.dribbble || "#", label: "Dribbble", icon: Dribbble },
    { href: profile?.linkedin || "#", label: "LinkedIn", icon: Linkedin },
    { href: profile?.github || "#", label: "GitHub", icon: Github },
  ]

  return (
    <footer className="bg-foreground text-background py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Social Links Row */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-background/60 mb-8">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-background transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>

          {/* Main CTA */}
          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-heading font-bold tracking-tight mb-12">
            LET&apos;S TALK
          </h2>

          {/* Social Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 rounded-full border border-background/20 hover:bg-background hover:text-foreground transition-colors text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label.toUpperCase()}
              </motion.a>
            ))}
            <Link href="/contact">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-2.5 rounded-full bg-background text-foreground text-sm font-medium"
              >
                CONTACT ME
              </motion.span>
            </Link>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>&copy; {new Date().getFullYear()} PORTFOLIO. All Rights Reserved.</p>
            <p>Designed by {profile?.name || "Your Name"}</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
