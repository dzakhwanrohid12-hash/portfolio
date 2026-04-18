-- Seed Data for Portfolio
-- Insert default profile

INSERT INTO profiles (id, name, title, tagline, bio, established_year, email, instagram, linkedin, dribbble, behance, github)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Your Name',
  'Designer & Developer',
  'I am passionate about creating websites that stand out from the crowd.',
  'A talented freelance designer & developer, known for creative prowess and technical expertise. Specializing in UI/UX design, web development, and creating memorable digital experiences.',
  2020,
  'hello@yourportfolio.com',
  'https://instagram.com/yourhandle',
  'https://linkedin.com/in/yourhandle',
  'https://dribbble.com/yourhandle',
  'https://behance.net/yourhandle',
  'https://github.com/yourhandle'
) ON CONFLICT DO NOTHING;

-- Insert stats
INSERT INTO stats (profile_id, label, value, display_order) VALUES
('00000000-0000-0000-0000-000000000001', 'SUCCESS PROJECT', '50+', 1),
('00000000-0000-0000-0000-000000000001', 'PRODUCT LAUNCHES', '30+', 2),
('00000000-0000-0000-0000-000000000001', 'YEARS EXPERIENCE', '5+', 3)
ON CONFLICT DO NOTHING;

-- Insert skills/services
INSERT INTO skills (profile_id, name, description, display_order) VALUES
('00000000-0000-0000-0000-000000000001', 'UI/UX', 'Creating intuitive and beautiful user interfaces', 1),
('00000000-0000-0000-0000-000000000001', 'WEB DESIGN', 'Modern and responsive website designs', 2),
('00000000-0000-0000-0000-000000000001', 'LANDING PAGE DESIGN', 'High-converting landing pages', 3),
('00000000-0000-0000-0000-000000000001', 'UI DESIGN FIGMA', 'Professional designs using Figma', 4),
('00000000-0000-0000-0000-000000000001', 'MOBILE APP DESIGN', 'Beautiful mobile application interfaces', 5)
ON CONFLICT DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, category, image_url, technologies, featured, display_order) VALUES
('The Power of Life', 'A mobile app design focused on wellness and healthy living', 'Mobile App', '/placeholder.svg?height=400&width=600', ARRAY['React Native', 'Figma', 'UI/UX'], true, 1),
('Handle Your Electricity', 'Solar panel mobile app for monitoring energy consumption', 'Mobile App', '/placeholder.svg?height=400&width=600', ARRAY['Flutter', 'Firebase', 'IoT'], true, 2),
('Furniture App', 'E-commerce application for modern furniture', 'Mobile App', '/placeholder.svg?height=400&width=600', ARRAY['React Native', 'Node.js', 'MongoDB'], true, 3),
('Corporate Website', 'Professional website for a tech company', 'Web Design', '/placeholder.svg?height=400&width=600', ARRAY['Next.js', 'Tailwind CSS', 'Vercel'], false, 4),
('E-commerce Platform', 'Full-featured online store with payment integration', 'Web Design', '/placeholder.svg?height=400&width=600', ARRAY['Next.js', 'Stripe', 'PostgreSQL'], false, 5),
('Dashboard Analytics', 'Data visualization dashboard for business metrics', 'Web Design', '/placeholder.svg?height=400&width=600', ARRAY['React', 'D3.js', 'REST API'], false, 6)
ON CONFLICT DO NOTHING;
