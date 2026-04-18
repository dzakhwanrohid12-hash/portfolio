"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProjectsSectionProps {
  projects: Project[]
  showAll?: boolean
}

const categories = ["All", "Mobile App", "Web Design", "UI/UX"]

export function ProjectsSection({ projects, showAll = false }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory)

  const displayProjects = showAll ? filteredProjects : filteredProjects.slice(0, 3)

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight">
            FEATURED PROJECT
          </h2>
          {!showAll && (
            <Link
              href="/projects"
              className="flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
            >
              View All Projects
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === category
                  ? "bg-foreground text-background"
                  : "bg-secondary hover:bg-secondary/80"
              )}
            >
              {category}
            </button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-full border border-border hover:bg-secondary transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4">
                  <Image
                    src={project.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-heading font-semibold group-hover:text-muted-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
