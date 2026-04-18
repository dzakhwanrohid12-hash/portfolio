"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types"

interface ProjectsManagerProps {
  projects: Project[]
}

const defaultProject = {
  title: "",
  description: "",
  category: "Web Design",
  image_url: "",
  project_url: "",
  technologies: [] as string[],
  featured: false,
  display_order: 0,
}

export function ProjectsManager({ projects }: ProjectsManagerProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(defaultProject)
  const [techInput, setTechInput] = useState("")

  const openCreateModal = () => {
    setEditingProject(null)
    setFormData(defaultProject)
    setTechInput("")
    setIsModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || "",
      category: project.category,
      image_url: project.image_url || "",
      project_url: project.project_url || "",
      technologies: project.technologies || [],
      featured: project.featured,
      display_order: project.display_order,
    })
    setTechInput("")
    setIsModalOpen(true)
  }

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    if (editingProject) {
      await supabase
        .from("projects")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingProject.id)
    } else {
      await supabase.from("projects").insert([formData])
    }

    setIsLoading(false)
    setIsModalOpen(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    const supabase = createClient()
    await supabase.from("projects").delete().eq("id", id)
    router.refresh()
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </motion.div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden">
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 text-xs bg-secondary rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{project.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(project)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-background rounded-2xl shadow-xl max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-heading font-bold">
                  {editingProject ? "Edit Project" : "Add Project"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    >
                      <option value="Web Design">Web Design</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="UI/UX">UI/UX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project URL</label>
                  <input
                    type="url"
                    value={formData.project_url}
                    onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Technologies</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                      placeholder="Add technology..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm">Featured Project</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingProject ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
