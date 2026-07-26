"use client";

import { motion } from "framer-motion";
import { Check, Lock, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Skill } from "@/types";

interface SkillNodeProps {
  skill: Skill;
  index: number;
}

export default function SkillNode({ skill, index }: SkillNodeProps) {
  const router = useRouter();

  const handleClick = () => {
    if (skill.status !== "current") return;
    const nextLesson = skill.lessons.find((l) => !l.completed);
    if (nextLesson) {
      router.push(`/lesson/${nextLesson.id}`);
    }
  };

  // Progress for the ring (only on current skill)
  const completedLessons = skill.lessons.filter((l) => l.completed).length;
  const totalLessons = skill.lessons.length;
  const progress = totalLessons > 0 ? completedLessons / totalLessons : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.4, type: "spring" }}
      className="flex flex-col items-center gap-3"
    >
      {/* Progress ring + node */}
      <div className="relative">
        {/* Progress ring (current skill only) */}
        {skill.status === "current" && (
          <svg className="absolute -inset-2 w-[104px] h-[104px]" viewBox="0 0 104 104">
            <circle className="progress-ring-bg" cx="52" cy="52" r="48" strokeWidth="5" />
            <circle
              className="progress-ring-fill"
              cx="52" cy="52" r="48"
              strokeWidth="5"
              stroke="var(--color-primary)"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48}`}
              strokeDashoffset={`${2 * Math.PI * 48 * (1 - progress)}`}
            />
          </svg>
        )}

        {/* Crown for completed */}
        {skill.status === "completed" && (
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.12 + 0.3, type: "spring" }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
          >
            <Crown className="w-7 h-7 text-yellow-400 fill-yellow-400 drop-shadow-md" />
          </motion.div>
        )}

        <button
          onClick={handleClick}
          disabled={skill.status === "locked"}
          className={`skill-node ${skill.status} ${
            skill.status === "current" ? "animate-pulse-glow" : ""
          }`}
        >
          {skill.status === "completed" ? (
            <Check className="w-8 h-8" strokeWidth={3.5} />
          ) : skill.status === "locked" ? (
            <Lock className="w-7 h-7" />
          ) : (
            <span className="drop-shadow-sm">{skill.icon}</span>
          )}
        </button>
      </div>

      <span
        className={`text-sm font-extrabold tracking-tight ${
          skill.status === "locked"
            ? "text-[var(--color-text-secondary)] opacity-50"
            : skill.status === "current"
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-warning)]"
        }`}
      >
        {skill.title}
      </span>
    </motion.div>
  );
}
