"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Stat } from "@/lib/types"

interface StatsManagerProps {
  stats: Stat[]
  profileId: string | undefined
}

const defaultStat = {
  label: "",
  value: "",
  display_order: 0,
}

export function StatsManager({ stats, profileId }: StatsManagerProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingStat, setEditingStat] = useState<Stat | null>(null)
  const [formData, setFormData] = useState(defaultStat)

  const openCreateModal = () => {
    setEditingStat(null)
    setFormData(defaultStat)
    setIsModalOpen(true)
  }

  const openEditModal = (stat: Stat) => {
    setEditingStat(stat)
    setFormData({
      label: stat.label,
      value: stat.value,
      display_order: stat.display_order,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    if (editingStat) {
      await supabase
        .from("stats")
        .update(formData)
        .eq("id", editingStat.id)
    } else {
      await supabase.from("stats").insert([{
        ...formData,
        profile_id: profileId,
      }])
    }

    setIsLoading(false)
    setIsModalOpen(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stat?")) return

    const supabase = createClient()
    await supabase.from("stats").delete().eq("id", id)
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
          <h1 className="text-3xl font-heading font-bold mb-2">Stats</h1>
          <p className="text-muted-foreground">
            Manage your achievement statistics.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Stat
        </button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="p-6 rounded-2xl border border-border bg-card text-center relative group"
          >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                onClick={() => openEditModal(stat)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(stat.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-4xl font-heading font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider">
              {stat.label}
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
                  {editingStat ? "Edit Stat" : "Add Stat"}
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
                  <label className="block text-sm font-medium mb-2">Value</label>
                  <input
                    type="text"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    placeholder="e.g., 100+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Label</label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-foreground focus:outline-none transition-colors"
                    placeholder="e.g., Projects Completed"
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
                    {editingStat ? "Update" : "Create"}
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
