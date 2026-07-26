from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User, Lesson, Exercise, UserProgress, Achievement, UserAchievement
from schemas import (
    LessonDetailResponse, ExerciseOut, ExerciseOptionOut,
    AnswerRequest, AnswerResponse,
    LessonCompleteRequest, LessonCompleteResponse, AchievementOut,
)

router = APIRouter()

DEFAULT_USER_ID = 1
XP_PER_CORRECT = 10
LESSON_BONUS_XP = 10


@router.get("/lesson/{lesson_id}", response_model=LessonDetailResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)) -> LessonDetailResponse:
    lesson = db.query(Lesson).get(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises_out = [
        ExerciseOut(
            id=ex.id,
            type=ex.type,
            prompt=ex.prompt,
            correct_answer=ex.correct_answer,
            options=[
                ExerciseOptionOut(
                    id=opt.id,
                    text=opt.text,
                    is_correct=opt.is_correct,
                    match_text=opt.match_text,
                )
                for opt in ex.options
            ],
        )
        for ex in lesson.exercises
    ]

    return LessonDetailResponse(
        id=lesson.id,
        skill_title=lesson.skill.title,
        exercises=exercises_out,
    )


@router.post("/lesson/answer", response_model=AnswerResponse)
def submit_answer(body: AnswerRequest, db: Session = Depends(get_db)) -> AnswerResponse:
    user = db.query(User).get(DEFAULT_USER_ID)

    if not body.correct:
        user.hearts = max(0, user.hearts - 1)
        db.commit()

    return AnswerResponse(hearts_remaining=user.hearts)


@router.post("/lesson/complete", response_model=LessonCompleteResponse)
def complete_lesson(body: LessonCompleteRequest, db: Session = Depends(get_db)) -> LessonCompleteResponse:
    user = db.query(User).get(DEFAULT_USER_ID)
    lesson = db.query(Lesson).get(body.lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Mark lesson as completed
    progress = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == DEFAULT_USER_ID, UserProgress.lesson_id == lesson.id)
        .first()
    )
    if not progress:
        progress = UserProgress(user_id=DEFAULT_USER_ID, lesson_id=lesson.id)
        db.add(progress)

    progress.completed = True
    progress.xp_earned = body.xp_earned

    # Award XP
    user.xp += body.xp_earned
    user.daily_xp += body.xp_earned
    user.gems += 5  # Small gem reward

    # Update streak
    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    if user.last_active_date != today:
        if user.last_active_date == yesterday:
            user.streak += 1
        else:
            user.streak = 1
        user.daily_xp = body.xp_earned
        user.last_active_date = today

    db.flush()

    # Check achievements
    new_achievements = _check_achievements(db, user)

    db.commit()

    return LessonCompleteResponse(
        total_xp=user.xp,
        hearts=user.hearts,
        streak=user.streak,
        new_achievements=new_achievements,
    )


def _check_achievements(db: Session, user: User) -> list[AchievementOut]:
    """Check and award any new achievements the user has earned."""
    earned_ids: set[int] = {
        ua.achievement_id
        for ua in db.query(UserAchievement)
        .filter(UserAchievement.user_id == user.id)
        .all()
    }

    completed_lessons = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == user.id, UserProgress.completed)
        .count()
    )

    all_achievements = db.query(Achievement).all()
    new_achievements: list[AchievementOut] = []

    for ach in all_achievements:
        if ach.id in earned_ids:
            continue

        earned = False
        if ach.condition_type == "xp" and user.xp >= ach.condition_value:
            earned = True
        elif ach.condition_type == "streak" and user.streak >= ach.condition_value:
            earned = True
        elif ach.condition_type == "lessons" and completed_lessons >= ach.condition_value:
            earned = True

        if earned:
            db.add(UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                earned_at=date.today().isoformat(),
            ))
            new_achievements.append(
                AchievementOut(
                    id=ach.id,
                    title=ach.title,
                    description=ach.description,
                    icon=ach.icon,
                    earned=True,
                )
            )

    return new_achievements
