"use client"

import { motion } from "framer-motion"
import { ArrowDown, ArrowRight } from "lucide-react"
import type { Skill } from "@/lib/types"

interface ServicesSectionProps {
  skills: Skill[]
}

export function ServicesSection({ skills }: ServicesSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight mb-6">
            THE SERVICES WE
            <br />
            PROVIDE
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creating visually appealing and functional websites tailored to the client&apos;s needs and goals, providing a consistent user experience across platforms.
          </p>
        </motion.div>

        {/* Services List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ x: 10 }}
              className="group flex items-center justify-between p-6 bg-background rounded-2xl border border-border hover:border-foreground/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <span className="text-sm text-muted-foreground font-medium">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-heading font-semibold text-lg">
                  {skill.name.toUpperCase()}
                </span>
              </div>
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: -45 }}
                className="p-2 rounded-full border border-border group-hover:bg-foreground group-hover:text-background transition-colors"
              >
                <ArrowDown className="w-4 h-4 group-hover:hidden" />
                <ArrowRight className="w-4 h-4 hidden group-hover:block" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
