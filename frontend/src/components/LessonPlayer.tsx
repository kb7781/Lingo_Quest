"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Zap, HeartCrack, X, Trophy } from "lucide-react";
import ProgressBar from "./ProgressBar";
import ExerciseRenderer from "./ExerciseRenderer";
import FeedbackBar from "./FeedbackBar";
import Modal from "./Modal";
import { useUser } from "@/context/UserContext";
import api from "@/lib/api";
import type { Exercise, LessonDetail } from "@/types";

interface LessonPlayerProps {
  lesson: LessonDetail;
}

const XP_PER_CORRECT = 10;

export default function LessonPlayer({ lesson }: LessonPlayerProps) {
  const router = useRouter();
  const { user, updateHearts, addXP } = useUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showOutOfHearts, setShowOutOfHearts] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);

  const exercises = lesson.exercises;
  const currentExercise: Exercise | undefined = exercises[currentIndex];
  const hearts = user?.hearts ?? 5;

  const handleAnswer = async (correct: boolean) => {
    const exercise = exercises[currentIndex];

    await api.post("/lesson/answer", {
      exercise_id: exercise.id,
      correct,
    });

    if (correct) {
      setCorrectCount((c) => c + 1);
      setXpEarned((x) => x + XP_PER_CORRECT);
      addXP(XP_PER_CORRECT);
      setShowXpPopup(true);
      setTimeout(() => setShowXpPopup(false), 1200);
    } else {
      const newHearts = hearts - 1;
      updateHearts(newHearts);

      if (newHearts <= 0) {
        setFeedback({ correct: false, answer: exercise.correct_answer });
        setTimeout(() => {
          setFeedback(null);
          setShowOutOfHearts(true);
        }, 1500);
        return;
      }
    }

    setFeedback({ correct, answer: exercise.correct_answer });
  };

  const handleContinue = async () => {
    setFeedback(null);

    if (currentIndex + 1 >= exercises.length) {
      const totalXp = xpEarned + 10;
      const res = await api.post("/lesson/complete", {
        lesson_id: lesson.id,
        xp_earned: totalXp,
      });
      addXP(10);
      updateHearts(res.data.hearts);
      setXpEarned(totalXp);
      setShowComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRefill = async () => {
    await api.post("/practice/refill");
    updateHearts(5);
    setShowOutOfHearts(false);
  };

  if (!currentExercise && !showComplete) return null;

  const accuracy = exercises.length > 0 ? Math.round((correctCount / exercises.length) * 100) : 0;

  return (
    <div className="relative min-h-screen pb-36">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[var(--color-bg)] py-4 px-4">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
          <div className="flex-1">
            <ProgressBar current={currentIndex + (feedback ? 1 : 0)} total={exercises.length} />
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            <span className="font-black text-red-500">{hearts}</span>
          </div>
        </div>
      </div>

      {/* Exercise */}
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {currentExercise && (
              <ExerciseRenderer
                exercise={currentExercise}
                onAnswer={handleAnswer}
                disabled={!!feedback}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* XP Popup */}
      <AnimatePresence>
        {showXpPopup && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#58cc02] to-[#46a302] px-5 py-3 font-black text-white shadow-lg"
          >
            <Zap className="h-5 w-5 fill-white" />
            +{XP_PER_CORRECT} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      {feedback && (
        <FeedbackBar
          correct={feedback.correct}
          correctAnswer={feedback.answer}
          onContinue={handleContinue}
        />
      )}

      {/* Lesson Complete Modal */}
      <Modal open={showComplete}>
        <div className="text-center py-2">
          {/* Celebration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="mb-2"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-1 text-2xl font-black"
          >
            Lesson Complete!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 font-bold text-[var(--color-text-secondary)]"
          >
            You&apos;re making amazing progress! 🎉
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 grid grid-cols-2 gap-3"
          >
            <div className="glass-card p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500">
                <Star className="h-5 w-5 text-white fill-white" />
              </div>
              <p className="text-2xl font-black gradient-text">{xpEarned}</p>
              <p className="text-xs font-bold text-[var(--color-text-secondary)]">XP Earned</p>
            </div>
            <div className="glass-card p-4">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#58cc02] to-[#46a302]">
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <p className="text-2xl font-black gradient-text">{accuracy}%</p>
              <p className="text-xs font-bold text-[var(--color-text-secondary)]">Accuracy</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={() => router.push("/")}
              className="btn-3d btn-primary w-full py-4 text-base"
            >
              Continue
            </button>
          </motion.div>
        </div>
      </Modal>

      {/* Out of Hearts Modal */}
      <Modal open={showOutOfHearts}>
        <div className="text-center py-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
              <HeartCrack className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <h2 className="mb-2 text-2xl font-black">Out of Hearts!</h2>
          <p className="mb-6 font-bold text-[var(--color-text-secondary)]">
            Don&apos;t worry — practice to refill and try again!
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRefill}
              className="btn-3d btn-primary w-full py-4 text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 fill-white" />
                Practice to Refill
              </span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="btn-3d btn-outline w-full py-4 text-base"
            >
              Go Home
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
