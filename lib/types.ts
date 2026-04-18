export interface Profile {
  id: string
  name: string
  title: string
  tagline: string
  bio: string
  avatar_url: string | null
  established_year: number
  email: string | null
  phone: string | null
  location: string | null
  instagram: string | null
  linkedin: string | null
  dribbble: string | null
  behance: string | null
  github: string | null
  created_at: string
  updated_at: string
}

export interface Stat {
  id: string
  profile_id: string
  label: string
  value: string
  display_order: number
  created_at: string
}

export interface Skill {
  id: string
  profile_id: string
  name: string
  description: string | null
  display_order: number
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  category: string
  image_url: string | null
  project_url: string | null
  technologies: string[]
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  email: string
  created_at: string
}
