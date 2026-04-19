"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { Profile, Skill } from "@/lib/types";

interface HeroSectionProps {
  profile: Profile | null;
  skills: Skill[];
}

export function HeroSection({ profile, skills }: HeroSectionProps) {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-bold leading-tight tracking-tight">
                <span className="block">EXPLORE MY</span>
                <span className="block">PORTFOLIO</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center gap-6"
            >
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                Designer EST.{profile?.established_year || 2020}
              </p>
              <motion.button
                onClick={scrollToAbout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-full border border-border hover:bg-secondary transition-colors"
                aria-label="Scroll to about section"
              >
                <ArrowDown className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-muted-foreground max-w-md text-lg"
            >
              {profile?.tagline ||
                "I am passionate about creating websites that stand out from the crowd."}
            </motion.p>
          </div>

          {/* Right Content - Photo & Skills */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              {/* Profile Image Placeholder */}
              <div className="relative mx-auto w-full max-w-md aspect-[3/4] overflow-hidden rounded-3xl bg-gradient-to-b from-secondary to-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-[url('/profil.jpg')] bg-cover bg-center grayscale" />
                </div>
              </div>

              {/* Skills List */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 space-y-3"
              >
                {skills.slice(0, 5).map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-sm font-medium text-right"
                  >
                    {skill.name.toUpperCase()}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-secondary/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl -z-10" />
    </section>
  );
}
