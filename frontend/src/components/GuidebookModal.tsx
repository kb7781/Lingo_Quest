"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Volume2, Sparkles } from "lucide-react";
import type { Unit } from "@/types";

interface GuidebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit;
}

export default function GuidebookModal({ isOpen, onClose, unit }: GuidebookModalProps) {
  if (!isOpen) return null;

  // Guidebook content tailored to Unit 1 and Unit 2
  const guidebookContent: Record<number, { keyPhrases: { es: string; en: string; note?: string }[]; grammarTip: { title: string; body: string } }> = {
    1: {
      keyPhrases: [
        { es: "¡Hola!", en: "Hello!", note: "Common greeting" },
        { es: "Buenos días", en: "Good morning", note: "Used until noon" },
        { es: "Por favor", en: "Please", note: "Polite request" },
        { es: "Muchas gracias", en: "Thank you very much", note: "Expressing gratitude" },
        { es: "¿Cómo estás?", en: "How are you?", note: "Informal question" },
        { es: "Mucho gusto", en: "Nice to meet you", note: "Upon introduction" },
        { es: "Una manzana", en: "An apple", note: "Feminine noun" },
        { es: "El agua", en: "The water", note: "Masculine article used for sound" },
      ],
      grammarTip: {
        title: "Grammar Tip: Gender of Nouns",
        body: "In Spanish, all nouns are either masculine or feminine. Typically, nouns ending in -o are masculine (el chico, el libro) and nouns ending in -a are feminine (la chica, la manzana). Use 'el' for masculine and 'la' for feminine!",
      },
    },
    2: {
      keyPhrases: [
        { es: "¿Dónde está el hotel?", en: "Where is the hotel?", note: "Asking directions" },
        { es: "Necesito un boleto", en: "I need a ticket", note: "Travel request" },
        { es: "Un taxi, por favor", en: "A taxi, please", note: "Transportation" },
        { es: "Hable más despacio", en: "Speak slower, please", note: "Helpful phrase" },
        { es: "Lo siento", en: "I am sorry", note: "Apology" },
        { es: "Con permiso", en: "Excuse me", note: "Passing by people" },
      ],
      grammarTip: {
        title: "Grammar Tip: Asking Questions",
        body: "Spanish uses inverted question marks (¿) at the beginning of questions. Question words like ¿Dónde? (Where?), ¿Qué? (What?), and ¿Cómo? (How?) always carry an accent mark!",
      },
    },
  };

  const content = guidebookContent[unit.id] || guidebookContent[1];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-3xl bg-[var(--color-card)] border-2 border-[var(--color-border)] shadow-2xl overflow-hidden"
        >
          {/* Top Header Banner */}
          <div className="bg-[#58cc02] p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest opacity-85">UNIT {unit.id} GUIDEBOOK</span>
                <h2 className="text-2xl font-black">{unit.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Grammar Tip Box */}
            <div className="rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 p-4 flex gap-3 items-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-amber-600 dark:text-amber-400 text-sm uppercase tracking-wider mb-1">
                  {content.grammarTip.title}
                </h3>
                <p className="text-xs font-bold text-[var(--color-text-secondary)] leading-relaxed">
                  {content.grammarTip.body}
                </p>
              </div>
            </div>

            {/* Key Phrases Section */}
            <div>
              <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                <span>Key Vocabulary & Phrases</span>
              </h3>
              <div className="grid gap-2.5">
                {content.keyPhrases.map((phrase, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-primary)]/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-black text-sm">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-black text-base text-[var(--color-primary)]">{phrase.es}</p>
                        <p className="font-bold text-xs text-[var(--color-text-secondary)]">{phrase.en}</p>
                      </div>
                    </div>
                    {phrase.note && (
                      <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg)] px-2.5 py-1 rounded-full border border-[var(--color-border)]">
                        {phrase.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-center shrink-0">
            <button onClick={onClose} className="btn-3d btn-primary w-full py-3 text-sm font-black uppercase">
              GOT IT!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
