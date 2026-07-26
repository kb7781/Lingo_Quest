"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface FeedbackBarProps {
  correct: boolean;
  correctAnswer: string;
  onContinue: () => void;
}

export default function FeedbackBar({ correct, correctAnswer, onContinue }: FeedbackBarProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`fixed bottom-0 left-0 right-0 z-50 p-5 ${
        correct
          ? "bg-gradient-to-t from-green-100 to-green-50 dark:from-green-950/60 dark:to-green-950/40 border-t-[3px] border-[var(--color-primary)]"
          : "bg-gradient-to-t from-red-100 to-red-50 dark:from-red-950/60 dark:to-red-950/40 border-t-[3px] border-[var(--color-danger)]"
      }`}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md ${
              correct
                ? "bg-[var(--color-primary)]"
                : "bg-[var(--color-danger)]"
            }`}
          >
            {correct ? (
              <Check className="h-6 w-6 text-white" strokeWidth={3.5} />
            ) : (
              <X className="h-6 w-6 text-white" strokeWidth={3.5} />
            )}
          </motion.div>

          {/* Text */}
          <div>
            <p className={`text-lg font-black ${correct ? "text-[var(--color-primary)]" : "text-[var(--color-danger)]"}`}>
              {correct ? "Amazing!" : "Oops, not quite!"}
            </p>
            {!correct && (
              <p className="text-sm font-bold text-[var(--color-text-secondary)]">
                Answer: <span className="text-[var(--color-danger)] font-extrabold">{correctAnswer}</span>
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className={`btn-3d px-10 py-3 text-[15px] ${correct ? "btn-primary" : "btn-danger"}`}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
