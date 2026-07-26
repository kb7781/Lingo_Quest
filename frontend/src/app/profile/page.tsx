"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, Zap, Heart, BookOpen, GraduationCap, Gem } from "lucide-react";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import type { ProfileData, HomeData } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      api.get<HomeData>("/home").then((res) => setUser(res.data.user));
    }
    api.get<ProfileData>("/profile").then((res) => {
      setProfile(res.data);
      setLoading(false);
    });
  }, [user, setUser]);

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { icon: <Zap className="h-6 w-6 text-white fill-white" />, label: "Total XP", value: profile.user.xp, gradient: "from-yellow-400 to-yellow-600" },
    { icon: <Flame className="h-6 w-6 text-white fill-white" />, label: "Day Streak", value: profile.user.streak, gradient: "from-orange-400 to-orange-600" },
    { icon: <Heart className="h-6 w-6 text-white fill-white" />, label: "Hearts", value: profile.user.hearts, gradient: "from-red-400 to-red-600" },
    { icon: <Gem className="h-6 w-6 text-white" />, label: "Gems", value: profile.user.gems, gradient: "from-blue-400 to-blue-600" },
    { icon: <BookOpen className="h-6 w-6 text-white" />, label: "Lessons", value: profile.completed_lessons, gradient: "from-emerald-400 to-emerald-600" },
    { icon: <GraduationCap className="h-6 w-6 text-white" />, label: "Skills", value: `${profile.completed_skills}/${profile.total_skills}`, gradient: "from-purple-400 to-purple-600" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button onClick={() => router.push("/")} className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)] transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-black">Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Avatar + Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="mb-4 relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#58cc02] to-[#46a302] flex items-center justify-center text-4xl font-black text-white shadow-lg">
              {profile.user.display_name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 text-xs font-black text-white shadow-md border-2 border-[var(--color-bg)]">
              🇪🇸
            </div>
          </div>
          <h2 className="text-2xl font-black">{profile.user.display_name}</h2>
          <p className="text-sm font-bold text-[var(--color-text-secondary)]">Spanish Learner</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-3 gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="glass-card p-4 text-center"
            >
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                {stat.icon}
              </div>
              <p className="text-xl font-black">{stat.value}</p>
              <p className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-4 text-lg font-black">Achievements</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {profile.achievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={`glass-card p-4 text-center transition-all ${
                  ach.earned
                    ? "!border-yellow-400/50 !shadow-[0_0_20px_rgba(255,184,0,0.15)]"
                    : "opacity-40 grayscale"
                }`}
              >
                <div className={`mb-2 text-3xl ${ach.earned ? "animate-float" : ""}`}>{ach.icon}</div>
                <p className="text-sm font-extrabold">{ach.title}</p>
                <p className="text-[11px] text-[var(--color-text-secondary)] font-semibold">{ach.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
