"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Profile, Stat } from "@/lib/types"

interface StatsSectionProps {
  profile: Profile | null
  stats: Stat[]
}

export function StatsSection({ profile, stats }: StatsSectionProps) {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-end gap-3">
              <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-bold tracking-tight">
                ABOUT
              </h2>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="mb-3"
              >
                <ArrowUpRight className="w-8 h-8" />
              </motion.div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              {profile?.bio || "A talented freelance designer & developer, known for creative prowess and technical expertise."}
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 border border-border rounded-2xl text-center bg-card hover:border-foreground/20 transition-colors"
            >
              <div className="text-4xl sm:text-5xl font-heading font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
