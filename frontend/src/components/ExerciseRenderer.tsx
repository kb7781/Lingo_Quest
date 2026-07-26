"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Exercise } from "@/types";

interface ExerciseRendererProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

export default function ExerciseRenderer({ exercise, onAnswer, disabled }: ExerciseRendererProps) {
  switch (exercise.type) {
    case "multiple_choice":
      return <MultipleChoice exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case "word_bank":
      return <WordBank exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case "match_pairs":
      return <MatchPairs exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case "fill_blank":
      return <FillBlank exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case "type_answer":
      return <TypeAnswer exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
  }
}

// ─── Shared ───

interface ExerciseProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
  disabled: boolean;
}

function Prompt({ text, subtitle }: { text: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {subtitle && (
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">{subtitle}</p>
      )}
      <h2 className="text-2xl font-black leading-tight sm:text-[28px]">{text}</h2>
    </div>
  );
}

// ─── 1. Multiple Choice ───

function MultipleChoice({ exercise, onAnswer, disabled }: ExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (text: string) => {
    if (disabled || selected) return;
    setSelected(text);
    onAnswer(text === exercise.correct_answer);
  };

  return (
    <div>
      <Prompt text={exercise.prompt} subtitle="Select the correct answer" />
      <div className="grid gap-3">
        {exercise.options.map((opt, i) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(opt.text)}
            disabled={disabled || !!selected}
            className={`option-card ${selected === opt.text ? "selected" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] text-xs font-black text-[var(--color-text-secondary)]">
                {i + 1}
              </span>
              <span>{opt.text}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── 2. Word Bank ───

function WordBank({ exercise, onAnswer, disabled }: ExerciseProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleWordTap = (word: string) => {
    if (disabled || submitted) return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleCheck = () => {
    if (submitted) return;
    setSubmitted(true);
    const answer = selectedWords.join(" ");
    onAnswer(answer.toLowerCase() === exercise.correct_answer.toLowerCase());
  };

  return (
    <div>
      <Prompt text={exercise.prompt} subtitle="Tap the words in the correct order" />

      {/* Answer area */}
      <div className="mb-6 min-h-[72px] rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-4">
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {selectedWords.length === 0 && (
            <span className="text-sm font-semibold text-[var(--color-text-secondary)] italic">Tap words below...</span>
          )}
          {selectedWords.map((word, i) => (
            <motion.button
              key={i}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => handleWordTap(word)}
              className="rounded-xl border-2 border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-4 py-2 font-bold text-[var(--color-secondary)] transition-transform hover:scale-105"
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Word bank */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {exercise.options.map((opt) => {
          const isUsed = selectedWords.includes(opt.text);
          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleWordTap(opt.text)}
              disabled={disabled || submitted || isUsed}
              className={`option-card !w-auto !inline-flex !px-5 !py-2.5 ${
                isUsed ? "!opacity-30 !border-transparent" : ""
              }`}
            >
              {opt.text}
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={handleCheck}
        disabled={disabled || submitted || selectedWords.length === 0}
        className="btn-3d btn-primary w-full py-4 text-base"
      >
        Check
      </button>
    </div>
  );
}

// ─── 3. Match Pairs ───

function MatchPairs({ exercise, onAnswer, disabled }: ExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);

  const leftItems = exercise.options.map((o) => o.text);
  const rightItems = exercise.options.map((o) => o.match_text!);

  const shuffledRight = [...rightItems].sort(
    (a, b) => a.charCodeAt(0) + exercise.id - (b.charCodeAt(0) + exercise.id)
  );

  const handleRightClick = (rightText: string) => {
    if (!selectedLeft || disabled) return;

    const pair = exercise.options.find((o) => o.text === selectedLeft);
    if (pair && pair.match_text === rightText) {
      const newMatched = new Set(matched);
      newMatched.add(selectedLeft);
      newMatched.add(rightText);
      setMatched(newMatched);
      setSelectedLeft(null);

      if (newMatched.size === exercise.options.length * 2) {
        onAnswer(true);
      }
    } else {
      setWrong(rightText);
      setTimeout(() => setWrong(null), 500);
      setSelectedLeft(null);
    }
  };

  const pairStyle = (text: string, isSelected: boolean) => {
    if (matched.has(text)) return "option-card !border-[var(--color-primary)] !bg-[var(--color-primary)]/10 !text-[var(--color-primary)]";
    if (wrong === text) return "option-card !border-[var(--color-danger)] !bg-[var(--color-danger)]/10 !text-[var(--color-danger)]";
    if (isSelected) return "option-card selected";
    return "option-card";
  };

  return (
    <div>
      <Prompt text={exercise.prompt} subtitle="Tap matching pairs" />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2.5">
          {leftItems.map((text) => (
            <motion.button
              key={text}
              whileTap={{ scale: 0.97 }}
              onClick={() => !disabled && !matched.has(text) && setSelectedLeft(text)}
              disabled={disabled || matched.has(text)}
              className={pairStyle(text, selectedLeft === text)}
            >
              {text}
            </motion.button>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {shuffledRight.map((text) => (
            <motion.button
              key={text}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleRightClick(text)}
              disabled={disabled || matched.has(text)}
              className={pairStyle(text, false)}
            >
              {text}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 4. Fill in the Blank ───

function FillBlank({ exercise, onAnswer, disabled }: ExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (text: string) => {
    if (disabled || selected) return;
    setSelected(text);
    onAnswer(text.toLowerCase() === exercise.correct_answer.toLowerCase());
  };

  return (
    <div>
      <Prompt text={exercise.prompt} subtitle="Choose the missing word" />
      <div className="grid grid-cols-2 gap-3">
        {exercise.options.map((opt, i) => (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(opt.text)}
            disabled={disabled || !!selected}
            className={`option-card ${selected === opt.text ? "selected" : ""}`}
          >
            {opt.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── 5. Type the Answer ───

function TypeAnswer({ exercise, onAnswer, disabled }: ExerciseProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (submitted || !answer.trim()) return;
    setSubmitted(true);
    onAnswer(answer.trim().toLowerCase() === exercise.correct_answer.toLowerCase());
  };

  return (
    <div>
      <Prompt text={exercise.prompt} subtitle="Type your translation" />

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        disabled={disabled || submitted}
        placeholder="Type in Spanish..."
        autoFocus
        className="mb-6 w-full rounded-2xl border-2 border-b-4 border-[var(--color-border)] bg-[var(--color-card)] p-4 text-lg font-bold outline-none transition-all focus:border-[var(--color-secondary)] focus:shadow-[var(--shadow-glow-blue)] placeholder:text-[var(--color-text-secondary)] placeholder:font-normal"
      />

      <button
        onClick={handleSubmit}
        disabled={disabled || submitted || !answer.trim()}
        className="btn-3d btn-primary w-full py-4 text-base"
      >
        Check
      </button>
    </div>
  );
}
