"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Skill } from "@/lib/types"

interface SkillsManagerProps {
  skills: Skill[]
  profileId: string | undefined
}

const defaultSkill = {
  name: "",
  description: "",
  display_order: 0,
}

export function SkillsManager({ skills, profileId }: SkillsManagerProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState(defaultSkill)

  const openCreateModal = () => {
    setEditingSkill(null)
    setFormData(defaultSkill)
    setIsModalOpen(true)
  }

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      description: skill.description || "",
      display_order: skill.display_order,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    if (editingSkill) {
      await supabase
        .from("skills")
        .update(formData)
        .eq("id", editingSkill.id)
    } else {
      await supabase.from("skills").insert([{
        ...formData,
        profile_id: profileId,
      }])
    }

    setIsLoading(false)
    setIsModalOpen(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return

    const supabase = createClient()
    await supabase.from("skills").delete().eq("id", id)
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
          <h1 className="text-3xl font-heading font-bold mb-2">Skills</h1>
          <p className="text-muted-foreground">
            Manage your skills and services.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </motion.div>

      {/* Skills List */}
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-semibold">{skill.name}</h3>
              </div>
              {skill.description && (
                <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(skill)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
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
              className="w-full max-w-md bg-background rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-heading font-bold">
                  {editingSkill ? "Edit Skill" : "Add Skill"}
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
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    placeholder="e.g., Web Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors resize-none"
                    placeholder="Brief description of this skill..."
                  />
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
                    {editingSkill ? "Update" : "Create"}
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
