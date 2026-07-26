from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    display_name = Column(String)
    xp = Column(Integer, default=0)
    hearts = Column(Integer, default=5)
    gems = Column(Integer, default=100)
    streak = Column(Integer, default=0)
    daily_goal = Column(Integer, default=50)
    daily_xp = Column(Integer, default=0)
    last_active_date = Column(String, nullable=True)

    progress = relationship("UserProgress", back_populates="user")
    earned_achievements = relationship("UserAchievement", back_populates="user")


class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    code = Column(String, unique=True)
    flag_emoji = Column(String)
    description = Column(String)

    units = relationship("Unit", back_populates="language", order_by="Unit.order")


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=True)
    title = Column(String)
    description = Column(String)
    order = Column(Integer)

    language = relationship("Language", back_populates="units")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.order")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"))
    title = Column(String)
    icon = Column(String)
    order = Column(Integer)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.order")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"))
    order = Column(Integer)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship(
        "Exercise", back_populates="lesson", order_by="Exercise.order"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    type = Column(String)  # multiple_choice | word_bank | match_pairs | fill_blank | type_answer
    prompt = Column(String)
    correct_answer = Column(String)
    order = Column(Integer)

    lesson = relationship("Lesson", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise")


class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"))
    text = Column(String)
    is_correct = Column(Boolean, default=False)
    match_text = Column(String, nullable=True)  # Only for match_pairs

    exercise = relationship("Exercise", back_populates="options")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed = Column(Boolean, default=False)
    xp_earned = Column(Integer, default=0)

    user = relationship("User", back_populates="progress")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    icon = Column(String)
    condition_type = Column(String)  # xp | streak | lessons | skills
    condition_value = Column(Integer)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_id = Column(Integer, ForeignKey("achievements.id"))
    earned_at = Column(String)

    user = relationship("User", back_populates="earned_achievements")
    achievement = relationship("Achievement")
