"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";

interface ProjectsManagerProps {
  projects: Project[];
}

const defaultProject = {
  title: "",
  description: "",
  category: "Web Developer", // Default kategori diperbarui
  image_url: "",
  project_url: "",
  technologies: [] as string[],
  featured: false,
  display_order: 0,
};

export function ProjectsManager({ projects }: ProjectsManagerProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState(defaultProject);
  const [techInput, setTechInput] = useState("");
  // State baru untuk menampung file gambar
  const [imageFile, setImageFile] = useState<File | null>(null);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData(defaultProject);
    setTechInput("");
    setImageFile(null); // Reset file saat membuat baru
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      category: project.category,
      image_url: project.image_url || "",
      project_url: project.project_url || "",
      technologies: project.technologies || [],
      featured: project.featured,
      display_order: project.display_order,
    });
    setTechInput("");
    setImageFile(null); // Reset file saat mengedit
    setIsModalOpen(true);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const supabase = createClient();
    let finalImageUrl = formData.image_url;

    // Proses upload gambar jika ada file yang dipilih
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      // Upload ke bucket Supabase bernama 'portfolio-images'
      const { error: uploadError, data } = await supabase.storage
        .from("portfolio-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Supabase Error Detail:", uploadError);
        // Tampilkan pesan error langsung dari Supabase
        alert(`Gagal mengunggah gambar: ${uploadError.message}`);
        setIsLoading(false);
        return;
      }
      if (!uploadError && data) {
        // Dapatkan URL public setelah berhasil upload
        const { data: publicUrlData } = supabase.storage
          .from("portfolio-images")
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      } else {
        alert(
          "Gagal mengunggah gambar. Pastikan bucket 'portfolio-images' sudah dibuat dan diset ke Public di Supabase Storage.",
        );
        setIsLoading(false);
        return;
      }
    }

    const projectData = {
      ...formData,
      image_url: finalImageUrl,
      updated_at: new Date().toISOString(),
    };

    if (editingProject) {
      await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id);
    } else {
      await supabase.from("projects").insert([projectData]);
    }

    setIsLoading(false);
    setIsModalOpen(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", id);
    router.refresh();
  };

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
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden flex items-center justify-center border border-border">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(project)}
                className="p-2 rounded-lg hover:bg-secondary hover:text-primary transition-colors"
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
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
                <h2 className="text-xl font-heading font-bold">
                  {editingProject ? "Edit Project" : "Add Project"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary hover:text-destructive transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    placeholder="Project Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                    placeholder="Brief description of the project..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="Web Developer">Web Developer</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Game">Game</option>
                      <option value="Animasi">Animasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Bagian Upload Gambar yang Diperbarui */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Image
                  </label>
                  {(formData.image_url || imageFile) && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-border bg-secondary/50 h-40 relative">
                      <img
                        src={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : formData.image_url
                        }
                        alt="Project Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project URL
                  </label>
                  <input
                    type="url"
                    value={formData.project_url}
                    onChange={(e) =>
                      setFormData({ ...formData, project_url: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Technologies
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTech())
                      }
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                      placeholder="Add technology (e.g. Next.js, React)..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm font-medium"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="hover:text-destructive transition-colors p-0.5 rounded-full hover:bg-background/50"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-xl hover:bg-secondary/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-medium block">Featured Project</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Show this project on the homepage hero section.
                    </span>
                  </div>
                </label>

                <div className="flex gap-3 pt-4 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingProject ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
