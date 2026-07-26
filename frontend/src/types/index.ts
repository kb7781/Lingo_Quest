// --- User ---

export interface UserStats {
  id: number;
  display_name: string;
  xp: number;
  hearts: number;
  gems: number;
  streak: number;
  daily_goal: number;
  daily_xp: number;
}

// --- Course Structure ---

export interface LessonSummary {
  id: number;
  order: number;
  completed: boolean;
}

export interface Skill {
  id: number;
  title: string;
  icon: string;
  status: "completed" | "current" | "locked";
  lessons: LessonSummary[];
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Language {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
  description?: string;
}

export interface HomeData {
  user: UserStats;
  language: Language;
  units: Unit[];
}

// --- Exercises ---

export interface ExerciseOption {
  id: number;
  text: string;
  is_correct: boolean;
  match_text: string | null;
}

export type ExerciseType =
  | "multiple_choice"
  | "word_bank"
  | "match_pairs"
  | "fill_blank"
  | "type_answer";

export interface Exercise {
  id: number;
  type: ExerciseType;
  prompt: string;
  correct_answer: string;
  options: ExerciseOption[];
}

export interface LessonDetail {
  id: number;
  skill_title: string;
  exercises: Exercise[];
}

// --- API Responses ---

export interface AnswerResponse {
  hearts_remaining: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
}

export interface LessonCompleteResponse {
  total_xp: number;
  hearts: number;
  streak: number;
  new_achievements: Achievement[];
}

export interface ProfileData {
  user: UserStats;
  completed_lessons: number;
  completed_skills: number;
  total_skills: number;
  achievements: Achievement[];
}

export interface LeaderboardUser {
  id: number;
  display_name: string;
  xp: number;
  rank: number;
}

export interface LeaderboardData {
  leaderboard: LeaderboardUser[];
  current_user_rank: number;
}
