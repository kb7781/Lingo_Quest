"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, User, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "LEARN", icon: <Home className="w-6 h-6" /> },
    { href: "/leaderboard", label: "LEADERBOARDS", icon: <Trophy className="w-6 h-6" /> },
    { href: "/profile", label: "PROFILE", icon: <User className="w-6 h-6" /> },
    { href: "/settings", label: "SETTINGS", icon: <Settings className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] p-4 h-screen sticky top-0 shrink-0">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 py-4 mb-6 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#58cc02] to-[#46a302] text-white font-black text-xl shadow-md transition-transform group-hover:scale-110">
            🦉
          </div>
          <span className="font-black text-xl tracking-tight text-[var(--color-primary)]">
            Lingo<span className="text-[var(--color-text)]">Quest</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-sm tracking-wider transition-all border-2 ${
                  isActive
                    ? "bg-[#ddf4ff] dark:bg-sky-950/40 text-[var(--color-secondary)] border-[var(--color-secondary)] shadow-sm"
                    : "border-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                <div className={isActive ? "text-[var(--color-secondary)]" : ""}>{item.icon}</div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-[var(--color-border)] bg-[var(--color-bg)] p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-xl text-xs font-bold transition-all ${
                isActive ? "text-[var(--color-primary)] scale-105" : "text-[var(--color-text-secondary)]"
              }`}
            >
              {item.icon}
              <span className="mt-1 text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
