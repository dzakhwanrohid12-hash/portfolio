"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Calendar } from "lucide-react";
import type { Profile, Stat, Skill } from "@/lib/types";

interface AboutContentProps {
  profile: Profile | null;
  stats: Stat[];
  skills: Skill[];
}

export function AboutContent({ profile, stats, skills }: AboutContentProps) {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mb-24"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-8">
            ABOUT ME
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {profile?.bio ||
              "A talented freelance designer & developer, known for creative prowess and technical expertise."}
          </p>
        </motion.div>

        {/* Info Grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary"
          >
            <div className="absolute inset-0 bg-[url('/about.png')] bg-cover bg-center grayscale" />
          </motion.div>

          {/* Right - Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl font-heading font-bold mb-8">
              {profile?.name || "Your Name"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {profile?.title || "Designer & Developer"}
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-12">
              {profile?.location && (
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-secondary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-secondary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>{profile.email}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-secondary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile?.established_year && (
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-secondary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span>Started in {profile.established_year}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="text-center p-4 border border-border rounded-xl"
                >
                  <div className="text-2xl font-heading font-bold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-heading font-bold mb-12">
            MY EXPERTISE
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 border border-border rounded-2xl hover:border-foreground/20 transition-all"
              >
                <div className="text-sm text-muted-foreground mb-2">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {skill.description || "Professional expertise in this area."}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
