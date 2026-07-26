"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Moon, Sun, Volume2, Bell, Globe } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-3 px-4">
          <button onClick={() => router.push("/")} className="rounded-full p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)] transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-black">Settings</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">Preferences</p>

        <div className="flex flex-col gap-3">
          {/* Dark Mode */}
          <button
            onClick={toggleTheme}
            className="glass-card flex items-center justify-between p-4 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-md ${
                theme === "dark" ? "from-indigo-400 to-indigo-600" : "from-yellow-300 to-yellow-500"
              }`}>
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-white" />
                ) : (
                  <Sun className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="font-bold">Dark Mode</span>
            </div>
            <div
              className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
                theme === "dark" ? "bg-[var(--color-primary)]" : "bg-[var(--color-bg-tertiary)]"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>

          {/* Placeholder settings */}
          <SettingRow
            icon={<Volume2 className="h-5 w-5 text-white" />}
            gradient="from-emerald-400 to-emerald-600"
            label="Sound Effects"
          />
          <SettingRow
            icon={<Bell className="h-5 w-5 text-white" />}
            gradient="from-orange-400 to-orange-600"
            label="Notifications"
          />
          <SettingRow
            icon={<Globe className="h-5 w-5 text-white" />}
            gradient="from-blue-400 to-blue-600"
            label="Language"
            value="Spanish"
          />
        </div>

        <p className="mt-10 text-center text-sm font-bold text-[var(--color-text-secondary)]">
          LingoQuest v1.0
        </p>
        <p className="mt-1 text-center text-xs font-semibold text-[var(--color-text-secondary)]">
          Made with ❤️ for learning
        </p>
      </main>
    </div>
  );
}

function SettingRow({ icon, gradient, label, value }: { icon: React.ReactNode; gradient: string; label: string; value?: string }) {
  return (
    <div className="glass-card flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
          {icon}
        </div>
        <span className="font-bold">{label}</span>
      </div>
      <span className="text-sm font-bold text-[var(--color-text-secondary)]">{value ?? "Coming soon"}</span>
    </div>
  );
}
