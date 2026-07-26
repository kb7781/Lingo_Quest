"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Crown, Medal } from "lucide-react";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import type { LeaderboardData, HomeData } from "@/types";

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      api.get<HomeData>("/home").then((res) => setUser(res.data.user));
    }
    api.get<LeaderboardData>("/leaderboard").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [user, setUser]);

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  const podiumColors = [
    "from-yellow-300 to-yellow-500", // 1st
    "from-gray-300 to-gray-500",     // 2nd
    "from-amber-500 to-amber-700",   // 3rd
  ];

  const top3 = data.leaderboard.slice(0, 3);
  const rest = data.leaderboard.slice(3);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button onClick={() => router.push("/")} className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)] transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Trophy className="h-5 w-5 text-yellow-500" />
          <h1 className="text-lg font-black">Leaderboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-end justify-center gap-3"
        >
          {/* 2nd place */}
          {top3[1] && (
            <PodiumCard entry={top3[1]} rank={2} height="h-28" gradient={podiumColors[1]} isCurrentUser={top3[1].id === 1} />
          )}
          {/* 1st place */}
          {top3[0] && (
            <PodiumCard entry={top3[0]} rank={1} height="h-36" gradient={podiumColors[0]} isCurrentUser={top3[0].id === 1} crown />
          )}
          {/* 3rd place */}
          {top3[2] && (
            <PodiumCard entry={top3[2]} rank={3} height="h-24" gradient={podiumColors[2]} isCurrentUser={top3[2].id === 1} />
          )}
        </motion.div>

        {/* Rest of leaderboard */}
        <div className="flex flex-col gap-2">
          {rest.map((entry, i) => {
            const rank = i + 4;
            const isCurrentUser = entry.id === 1;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card flex items-center gap-4 p-4 ${
                  isCurrentUser ? "!border-[var(--color-primary)]/50 !shadow-[var(--shadow-glow-green)]" : ""
                }`}
              >
                <span className="w-8 text-center font-black text-[var(--color-text-secondary)]">{rank}</span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white text-sm ${
                    isCurrentUser
                      ? "bg-gradient-to-br from-[#58cc02] to-[#46a302]"
                      : "bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-dark)]"
                  }`}
                >
                  {entry.display_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className={`font-bold ${isCurrentUser ? "text-[var(--color-primary)]" : ""}`}>
                    {entry.display_name}
                    {isCurrentUser && <span className="ml-1.5 text-xs font-bold text-[var(--color-text-secondary)]">(you)</span>}
                  </p>
                </div>
                <p className="font-black text-[var(--color-text-secondary)]">{entry.xp.toLocaleString()} XP</p>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

interface PodiumCardProps {
  entry: { id: number; display_name: string; xp: number };
  rank: number;
  height: string;
  gradient: string;
  isCurrentUser: boolean;
  crown?: boolean;
}

function PodiumCard({ entry, rank, height, gradient, isCurrentUser, crown }: PodiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15, type: "spring" }}
      className="flex flex-col items-center"
    >
      {/* Avatar */}
      <div className="relative mb-2">
        {crown && (
          <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-md" />
        )}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white shadow-lg bg-gradient-to-br ${gradient} ${
            isCurrentUser ? "ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg)]" : ""
          }`}
        >
          {entry.display_name.charAt(0)}
        </div>
      </div>

      <p className="text-xs font-extrabold mb-1 max-w-[80px] truncate">{entry.display_name}</p>
      <p className="text-[11px] font-bold text-[var(--color-text-secondary)] mb-2">{entry.xp.toLocaleString()} XP</p>

      {/* Podium bar */}
      <div className={`${height} w-20 rounded-t-2xl bg-gradient-to-t ${gradient} flex items-start justify-center pt-3 shadow-md`}>
        <span className="text-xl font-black text-white/80">{rank}</span>
      </div>
    </motion.div>
  );
}
