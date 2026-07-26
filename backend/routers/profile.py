from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User, Skill, UserProgress, Achievement, UserAchievement
from schemas import ProfileResponse, UserStats, AchievementOut

router = APIRouter()

DEFAULT_USER_ID = 1


@router.get("/profile", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)) -> ProfileResponse:
    user = db.query(User).get(DEFAULT_USER_ID)

    completed_lesson_ids: set[int] = {
        p.lesson_id
        for p in db.query(UserProgress)
        .filter(UserProgress.user_id == DEFAULT_USER_ID, UserProgress.completed)
        .all()
    }

    # Count completed skills (all lessons in skill are complete)
    all_skills = db.query(Skill).all()
    total_skills = len(all_skills)
    completed_skills = 0
    for skill in all_skills:
        lesson_ids = {lesson.id for lesson in skill.lessons}
        if lesson_ids and lesson_ids.issubset(completed_lesson_ids):
            completed_skills += 1

    # Achievements
    earned_ids: set[int] = {
        ua.achievement_id
        for ua in db.query(UserAchievement)
        .filter(UserAchievement.user_id == DEFAULT_USER_ID)
        .all()
    }

    achievements = [
        AchievementOut(
            id=ach.id,
            title=ach.title,
            description=ach.description,
            icon=ach.icon,
            earned=ach.id in earned_ids,
        )
        for ach in db.query(Achievement).all()
    ]

    return ProfileResponse(
        user=UserStats(
            id=user.id,
            display_name=user.display_name,
            xp=user.xp,
            hearts=user.hearts,
            gems=user.gems,
            streak=user.streak,
            daily_goal=user.daily_goal,
            daily_xp=user.daily_xp,
        ),
        completed_lessons=len(completed_lesson_ids),
        completed_skills=completed_skills,
        total_skills=total_skills,
        achievements=achievements,
    )
