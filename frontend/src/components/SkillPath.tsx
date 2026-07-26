"use client";

import SkillNode from "./SkillNode";
import type { Unit, Language } from "@/types";

interface SkillPathProps {
  units: Unit[];
  language?: Language;
}

export default function SkillPath({ units, language }: SkillPathProps) {
  return (
    <div className="flex flex-col items-center py-8">
      {/* Active Language Badge */}
      {language && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-card)] px-5 py-2.5 shadow-sm">
          <span className="text-2xl">{language.flag_emoji}</span>
          <span className="text-lg font-black">{language.name}</span>
        </div>
      )}
      {units.map((unit) => (
        <div key={unit.id} className="w-full max-w-md">
          {/* Unit Header */}
          <div className="mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#58cc02] to-[#46a302] p-5 text-center text-white shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="h-1 w-8 rounded-full bg-white/30" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Unit {unit.id}</span>
              <div className="h-1 w-8 rounded-full bg-white/30" />
            </div>
            <h2 className="text-xl font-black">{unit.title}</h2>
            <p className="text-sm font-bold opacity-75">{unit.description}</p>
          </div>

          {/* Zigzag Skill Path */}
          <div className="flex flex-col items-center gap-8">
            {unit.skills.map((skill, index) => {
              const offsets = [0, 60, 0, -60];
              const offset = offsets[index % 4];

              return (
                <div
                  key={skill.id}
                  className="relative transition-transform duration-300"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  {/* Connector line */}
                  {index > 0 && (
                    <div className="absolute -top-8 left-1/2 h-8 w-[3px] -translate-x-1/2 rounded-full bg-[var(--color-border)]" />
                  )}
                  <SkillNode skill={skill} index={index} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Bottom spacer */}
      <div className="h-20" />
    </div>
  );
}
