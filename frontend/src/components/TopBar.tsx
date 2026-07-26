"use client";

import Link from "next/link";
import { Heart, Flame, Gem, Trophy, User, Settings, Zap } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function TopBar() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#58cc02] to-[#46a302] text-white font-black text-sm shadow-md transition-transform group-hover:scale-110">
            L
          </div>
          <span className="hidden font-black text-lg tracking-tight sm:block">
            <span className="text-[var(--color-primary)]">Lingo</span>
            <span className="text-[var(--color-text)]">Quest</span>
          </span>
        </Link>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <div className="stat-pill bg-orange-100 dark:bg-orange-950/30 text-[var(--color-fire)]">
            <Flame className="w-4 h-4 fill-current" />
            <span>{user.streak}</span>
          </div>
          <div className="stat-pill bg-yellow-100 dark:bg-yellow-950/30 text-yellow-500">
            <Zap className="w-4 h-4 fill-current" />
            <span>{user.xp}</span>
          </div>
          <div className="stat-pill bg-red-100 dark:bg-red-950/30 text-red-500">
            <Heart className="w-4 h-4 fill-current" />
            <span>{user.hearts}</span>
          </div>
          <div className="stat-pill bg-blue-100 dark:bg-blue-950/30 text-[var(--color-secondary)]">
            <Gem className="w-4 h-4" />
            <span>{user.gems}</span>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-0.5">
          <NavLink href="/leaderboard" icon={<Trophy className="w-5 h-5" />} />
          <NavLink href="/profile" icon={<User className="w-5 h-5" />} />
          <NavLink href="/settings" icon={<Settings className="w-5 h-5" />} />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl p-2.5 text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)] hover:scale-110"
    >
      {icon}
    </Link>
  );
}
