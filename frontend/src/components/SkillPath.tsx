"use client";

import { useState } from "react";
import SkillNode from "./SkillNode";
import GuidebookModal from "./GuidebookModal";
import type { Unit, Language } from "@/types";

interface SkillPathProps {
  units: Unit[];
  language?: Language;
}

export default function SkillPath({ units, language }: SkillPathProps) {
  const [activeGuidebookUnit, setActiveGuidebookUnit] = useState<Unit | null>(null);

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
          {/* Unit Header Banner matching Duolingo screenshot */}
          <div className="mb-10 rounded-2xl bg-[#58cc02] p-5 text-white shadow-lg flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider opacity-85 block mb-0.5">
                SECTION 1, UNIT {unit.id}
              </span>
              <h2 className="text-2xl font-black leading-tight">{unit.title}</h2>
              <p className="text-xs font-bold opacity-90 mt-0.5">{unit.description}</p>
            </div>
            <button
              onClick={() => setActiveGuidebookUnit(unit)}
              className="flex items-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur-md px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all shrink-0 cursor-pointer"
            >
              📖 GUIDEBOOK
            </button>
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

      {/* Guidebook Modal */}
      {activeGuidebookUnit && (
        <GuidebookModal
          isOpen={!!activeGuidebookUnit}
          onClose={() => setActiveGuidebookUnit(null)}
          unit={activeGuidebookUnit}
        />
      )}

      {/* Bottom spacer */}
      <div className="h-20" />
    </div>
  );
}
