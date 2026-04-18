"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProjectsContentProps {
  projects: Project[]
}

const categories = ["All", "Mobile App", "Web Design", "UI/UX"]

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6">
            MY PROJECTS
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A collection of my design and development work, showcasing creativity and technical expertise.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4">
                  <Image
                    src={project.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-full bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowUpRight className="w-6 h-6" />
                    </motion.div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-heading font-semibold group-hover:text-muted-foreground transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-secondary rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto"
              >
                <div className="relative aspect-video">
                  <Image
                    src={selectedProject.image_url || "/placeholder.svg?height=400&width=600"}
                    alt={selectedProject.title}
                    fill
                    className="object-cover rounded-t-3xl"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-3xl font-heading font-bold mt-1">
                        {selectedProject.title}
                      </h2>
                    </div>
                    {selectedProject.project_url && (
                      <a
                        href={selectedProject.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full border border-border hover:bg-secondary transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {selectedProject.description}
                  </p>
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 bg-secondary rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="mt-8 w-full py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
