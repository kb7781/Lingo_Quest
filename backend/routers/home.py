from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User, Language, Unit, Skill, Lesson, UserProgress
from schemas import HomeResponse, UserStats, LanguageOut, UnitOut, SkillOut, LessonOut

router = APIRouter()

DEFAULT_USER_ID = 1


@router.get("/home", response_model=HomeResponse)
def get_home(db: Session = Depends(get_db)) -> HomeResponse:
    user = db.query(User).get(DEFAULT_USER_ID)

    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    # Reset daily_xp if new day
    if user.last_active_date != today:
        user.daily_xp = 0
        # If user missed yesterday, reset streak to 0
        if user.last_active_date != yesterday and user.last_active_date is not None:
            user.streak = 0
        db.commit()

    # Fetch active language (default Spanish, id=1)
    lang = db.query(Language).filter(Language.code == "es").first()
    if not lang:
        lang = Language(id=1, name="Spanish", code="es", flag_emoji="🇪🇸", description="Learn the fundamentals of Spanish.")

    # Get all completed lesson IDs for this user
    completed_lesson_ids: set[int] = {
        p.lesson_id
        for p in db.query(UserProgress)
        .filter(UserProgress.user_id == DEFAULT_USER_ID, UserProgress.completed)
        .all()
    }

    units = db.query(Unit).order_by(Unit.order).all()
    units_out: list[UnitOut] = []

    found_current = False

    for unit in units:
        skills_out: list[SkillOut] = []

        for skill in unit.skills:
            lessons_out = [
                LessonOut(
                    id=lesson.id,
                    order=lesson.order,
                    completed=lesson.id in completed_lesson_ids,
                )
                for lesson in skill.lessons
            ]

            all_completed = all(l.completed for l in lessons_out) and len(lessons_out) > 0

            if all_completed:
                status = "completed"
            elif not found_current:
                status = "current"
                found_current = True
            else:
                status = "locked"

            skills_out.append(
                SkillOut(
                    id=skill.id,
                    title=skill.title,
                    icon=skill.icon,
                    status=status,
                    lessons=lessons_out,
                )
            )

        units_out.append(
            UnitOut(
                id=unit.id,
                title=unit.title,
                description=unit.description,
                skills=skills_out,
            )
        )

    return HomeResponse(
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
        language=LanguageOut(
            id=lang.id,
            name=lang.name,
            code=lang.code,
            flag_emoji=lang.flag_emoji,
            description=lang.description,
        ),
        units=units_out,
    )
