-- Portfolio Database Schema
-- This script creates all necessary tables for the portfolio website

-- Profile table for personal information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Your Name',
  title TEXT DEFAULT 'Designer & Developer',
  tagline TEXT DEFAULT 'Creating websites that stand out from the crowd',
  bio TEXT DEFAULT 'A talented freelance designer & developer, known for creative prowess and technical expertise.',
  avatar_url TEXT,
  established_year INTEGER DEFAULT 2020,
  email TEXT,
  phone TEXT,
  location TEXT,
  instagram TEXT,
  linkedin TEXT,
  dribbble TEXT,
  behance TEXT,
  github TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats table for achievement numbers
CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills/Services table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table for portfolio items
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Web Design',
  image_url TEXT,
  project_url TEXT,
  technologies TEXT[],
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users table (for dashboard access)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view portfolio data)
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can view stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);

-- Public can submit contact messages
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users who are admins)
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can manage stats" ON stats FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can manage skills" ON skills FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can update contact messages" ON contact_messages FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can delete contact messages" ON contact_messages FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

CREATE POLICY "Admins can manage admin_users" ON admin_users FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);
