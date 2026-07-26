from pydantic import BaseModel


# --- Shared ---

class UserStats(BaseModel):
    id: int
    display_name: str
    xp: int
    hearts: int
    gems: int
    streak: int
    daily_goal: int
    daily_xp: int


class AchievementOut(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    earned: bool


# --- Home ---

class LessonOut(BaseModel):
    id: int
    order: int
    completed: bool


class SkillOut(BaseModel):
    id: int
    title: str
    icon: str
    status: str  # completed | current | locked
    lessons: list[LessonOut]


class UnitOut(BaseModel):
    id: int
    title: str
    description: str
    skills: list[SkillOut]


class LanguageOut(BaseModel):
    id: int
    name: str
    code: str
    flag_emoji: str
    description: str | None = None


class HomeResponse(BaseModel):
    user: UserStats
    language: LanguageOut
    units: list[UnitOut]


# --- Lesson ---

class ExerciseOptionOut(BaseModel):
    id: int
    text: str
    is_correct: bool
    match_text: str | None = None


class ExerciseOut(BaseModel):
    id: int
    type: str
    prompt: str
    correct_answer: str
    options: list[ExerciseOptionOut]


class LessonDetailResponse(BaseModel):
    id: int
    skill_title: str
    exercises: list[ExerciseOut]


class AnswerRequest(BaseModel):
    exercise_id: int
    correct: bool


class AnswerResponse(BaseModel):
    hearts_remaining: int


class LessonCompleteRequest(BaseModel):
    lesson_id: int
    xp_earned: int


class LessonCompleteResponse(BaseModel):
    total_xp: int
    hearts: int
    streak: int
    new_achievements: list[AchievementOut]


# --- Profile ---

class ProfileResponse(BaseModel):
    user: UserStats
    completed_lessons: int
    completed_skills: int
    total_skills: int
    achievements: list[AchievementOut]


# --- Leaderboard ---

class LeaderboardUser(BaseModel):
    id: int
    display_name: str
    xp: int
    rank: int


class LeaderboardResponse(BaseModel):
    leaderboard: list[LeaderboardUser]
    current_user_rank: int
