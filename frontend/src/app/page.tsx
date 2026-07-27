"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import SkillPath from "@/components/SkillPath";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import type { HomeData } from "@/types";

export default function HomePage() {
  const { user, setUser } = useUser();
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    api
      .get<HomeData>("/home")
      .then((res) => {
        setHomeData(res.data);
        setUser(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
        <p className="text-sm font-bold text-[var(--color-text-secondary)]">Loading LingoQuest...</p>
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-500 font-black text-2xl">
          ⚡
        </div>
        <h2 className="text-xl font-black">Connecting to Server...</h2>
        <p className="max-w-sm text-sm font-bold text-[var(--color-text-secondary)]">
          The backend may be waking up from sleep mode. Please try again.
        </p>
        <button
          onClick={fetchData}
          className="btn-3d btn-primary px-8 py-3 text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { daily_xp, daily_goal, streak } = homeData.user;
  const dailyProgress = Math.min(1, daily_xp / daily_goal);
  const circumference = 2 * Math.PI * 28;

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Left Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col items-center min-w-0">
        {/* Mobile Top Bar */}
        <div className="w-full md:hidden">
          <TopBar />
        </div>

        <main className="w-full max-w-xl px-4 py-4">
          {/* Learning Path */}
          <SkillPath units={homeData.units} language={homeData.language} />
        </main>
      </div>

      {/* Right Sidebar (Desktop Stats & Quests) */}
      <RightSidebar
        languageFlag={homeData.language?.flag_emoji}
        languageName={homeData.language?.name}
      />
    </div>
  );
}
