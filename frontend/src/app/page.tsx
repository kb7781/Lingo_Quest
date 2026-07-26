"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import SkillPath from "@/components/SkillPath";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import type { HomeData } from "@/types";
import { Target, Flame } from "lucide-react";

export default function HomePage() {
  const { user, setUser } = useUser();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<HomeData>("/home").then((res) => {
      setHomeData(res.data);
      setUser(res.data.user);
      setLoading(false);
    });
  }, [setUser]);

  if (loading || !homeData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  const { daily_xp, daily_goal, streak } = homeData.user;
  const dailyProgress = Math.min(1, daily_xp / daily_goal);
  const circumference = 2 * Math.PI * 28;

  return (
    <div className="min-h-screen">
      <TopBar />

      <main className="mx-auto max-w-2xl px-4">
        {/* Stats Cards Row */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Daily Goal — Circular Progress */}
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle
                  className="progress-ring-bg"
                  cx="32" cy="32" r="28"
                  strokeWidth="5"
                />
                <circle
                  className="progress-ring-fill"
                  cx="32" cy="32" r="28"
                  strokeWidth="5"
                  stroke="var(--color-warning)"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - dailyProgress)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-5 h-5 text-[var(--color-warning)]" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">Daily Goal</p>
              <p className="text-lg font-black">{daily_xp} <span className="text-sm font-bold text-[var(--color-text-secondary)]">/ {daily_goal} XP</span></p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md flex-shrink-0">
              <Flame className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">Streak</p>
              <p className="text-lg font-black">{streak} <span className="text-sm font-bold text-[var(--color-text-secondary)]">{streak === 1 ? "day" : "days"}</span></p>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <SkillPath units={homeData.units} language={homeData.language} />
      </main>
    </div>
  );
}
