"use client";

import { useUser } from "@/context/UserContext";
import { Flame, Zap, Heart, Gem, Trophy, Target } from "lucide-react";
import Link from "next/link";

interface RightSidebarProps {
  languageFlag?: string;
  languageName?: string;
}

export default function RightSidebar({ languageFlag = "🇪🇸", languageName = "Spanish" }: RightSidebarProps) {
  const { user } = useUser();

  if (!user) return null;

  const dailyProgress = Math.min(1, user.daily_xp / user.daily_goal);

  return (
    <aside className="hidden lg:flex w-80 flex-col gap-5 p-6 h-screen sticky top-0 shrink-0 overflow-y-auto">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-3.5 shadow-sm">
        {/* Flag */}
        <div className="flex items-center gap-1.5 font-bold text-sm">
          <span className="text-xl">{languageFlag}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1 font-black text-sm text-[var(--color-fire)]">
          <Flame className="w-4 h-4 fill-current" />
          <span>{user.streak}</span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1 font-black text-sm text-yellow-500">
          <Zap className="w-4 h-4 fill-current" />
          <span>{user.xp}</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1 font-black text-sm text-red-500">
          <Heart className="w-4 h-4 fill-current" />
          <span>{user.hearts}</span>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-1 font-black text-sm text-[var(--color-secondary)]">
          <Gem className="w-4 h-4" />
          <span>{user.gems}</span>
        </div>
      </div>

      {/* Card 1: Leaderboards Progress */}
      <div className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-base">Unlock Leaderboards!</h3>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
        <p className="text-xs font-bold text-[var(--color-text-secondary)] mb-4">
          Complete lessons to earn XP and climb the top 3 podium!
        </p>
        <Link href="/leaderboard" className="btn-3d btn-secondary w-full py-2.5 text-xs text-center block">
          VIEW LEADERBOARD
        </Link>
      </div>



      {/* Card 3: Language & Course Info */}
      <div className="rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
        <h3 className="font-black text-base mb-2">Active Course</h3>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)]">
          <span className="text-3xl">{languageFlag}</span>
          <div>
            <p className="font-black text-sm">{languageName}</p>
            <p className="text-xs font-bold text-[var(--color-text-secondary)]">Spanish for English Speakers</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
