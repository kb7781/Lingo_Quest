from sqlalchemy.orm import Session

from models import (
    User, Language, Unit, Skill, Lesson, Exercise, ExerciseOption, Achievement,
)


def seed_database(db: Session) -> None:
    """Seeds the database with Spanish course content + fake leaderboard users."""

    # Skip if already seeded
    if db.query(User).first():
        return

    # --- Language (1 seeded language) ---
    language = Language(
        name="Spanish",
        code="es",
        flag_emoji="🇪🇸",
        description="Learn the fundamentals of Spanish.",
    )
    db.add(language)
    db.flush()

    # --- Users (1 real + 9 for leaderboard) ---
    users = [
        User(username="learner", display_name="You", xp=0, hearts=5, gems=100, streak=0),
        User(username="sofia", display_name="Sofia", xp=2450, hearts=5, gems=300, streak=14),
        User(username="carlos", display_name="Carlos", xp=1890, hearts=5, gems=250, streak=9),
        User(username="emma", display_name="Emma", xp=1650, hearts=5, gems=200, streak=7),
        User(username="lucas", display_name="Lucas", xp=1200, hearts=5, gems=180, streak=5),
        User(username="mia", display_name="Mia", xp=980, hearts=5, gems=150, streak=4),
        User(username="oliver", display_name="Oliver", xp=750, hearts=5, gems=120, streak=3),
        User(username="aria", display_name="Aria", xp=520, hearts=5, gems=100, streak=2),
        User(username="leo", display_name="Leo", xp=340, hearts=5, gems=80, streak=1),
        User(username="zara", display_name="Zara", xp=180, hearts=5, gems=60, streak=1),
    ]
    db.add_all(users)
    db.flush()

    # --- Unit ---
    unit = Unit(
        language_id=language.id,
        title="Basics",
        description="Learn the fundamentals of Spanish",
        order=1,
    )
    db.add(unit)
    db.flush()

    # --- Skills ---
    skills_data = [
        ("Greetings", "👋", 1),
        ("Food", "🍕", 2),
        ("Numbers", "🔢", 3),
        ("Family", "👨‍👩‍👧", 4),
    ]
    skills = []
    for title, icon, order in skills_data:
        skill = Skill(unit_id=unit.id, title=title, icon=icon, order=order)
        db.add(skill)
        skills.append(skill)
    db.flush()

    # --- Lessons & Exercises ---

    # Each skill gets 2 lessons, each lesson gets 3-4 exercises = ~28 total
    # Exercise types: multiple_choice, word_bank, match_pairs, fill_blank, type_answer

    _seed_greetings(db, skills[0])
    _seed_food(db, skills[1])
    _seed_numbers(db, skills[2])
    _seed_family(db, skills[3])

    # --- Achievements ---
    achievements = [
        Achievement(title="First Steps", description="Complete your first lesson", icon="🎯", condition_type="lessons", condition_value=1),
        Achievement(title="On Fire", description="Reach a 3-day streak", icon="🔥", condition_type="streak", condition_value=3),
        Achievement(title="Century", description="Earn 100 XP", icon="💯", condition_type="xp", condition_value=100),
        Achievement(title="Halfway There", description="Complete 4 lessons", icon="⭐", condition_type="lessons", condition_value=4),
        Achievement(title="Scholar", description="Complete all 8 lessons", icon="🎓", condition_type="lessons", condition_value=8),
    ]
    db.add_all(achievements)

    db.commit()


# ──────────────────────────────────────────────
# Skill 1: Greetings
# ──────────────────────────────────────────────

def _seed_greetings(db: Session, skill: Skill) -> None:
    # Lesson 1 — 4 exercises
    lesson1 = Lesson(skill_id=skill.id, order=1)
    db.add(lesson1)
    db.flush()

    _add_exercise(db, lesson1.id, order=1, type="multiple_choice",
        prompt="What does 'Hola' mean?",
        correct_answer="Hello",
        options=[("Hello", True), ("Goodbye", False), ("Please", False), ("Thanks", False)])

    _add_exercise(db, lesson1.id, order=2, type="type_answer",
        prompt="Translate: 'Good morning'",
        correct_answer="Buenos días")

    _add_exercise(db, lesson1.id, order=3, type="fill_blank",
        prompt="Buenas ___  (Good night)",
        correct_answer="noches",
        options=[("noches", True), ("días", False), ("tardes", False), ("luego", False)])

    _add_exercise(db, lesson1.id, order=4, type="word_bank",
        prompt="Translate: 'How are you?'",
        correct_answer="¿Cómo estás?",
        options=[("¿Cómo", True), ("estás?", True), ("eres", False), ("tienes", False)])

    # Lesson 2 — 3 exercises
    lesson2 = Lesson(skill_id=skill.id, order=2)
    db.add(lesson2)
    db.flush()

    _add_exercise(db, lesson2.id, order=1, type="multiple_choice",
        prompt="What does 'Adiós' mean?",
        correct_answer="Goodbye",
        options=[("Goodbye", True), ("Hello", False), ("Please", False), ("Sorry", False)])

    _add_exercise(db, lesson2.id, order=2, type="match_pairs",
        prompt="Match the Spanish words to their English translations",
        correct_answer="matched",
        pairs=[("Hola", "Hello"), ("Adiós", "Goodbye"), ("Gracias", "Thank you"), ("Por favor", "Please")])

    _add_exercise(db, lesson2.id, order=3, type="type_answer",
        prompt="Translate: 'See you later'",
        correct_answer="Hasta luego")


# ──────────────────────────────────────────────
# Skill 2: Food
# ──────────────────────────────────────────────

def _seed_food(db: Session, skill: Skill) -> None:
    lesson3 = Lesson(skill_id=skill.id, order=1)
    db.add(lesson3)
    db.flush()

    _add_exercise(db, lesson3.id, order=1, type="multiple_choice",
        prompt="'La manzana' means...",
        correct_answer="The apple",
        options=[("The apple", True), ("The orange", False), ("The banana", False), ("The grape", False)])

    _add_exercise(db, lesson3.id, order=2, type="word_bank",
        prompt="Translate: 'I eat bread'",
        correct_answer="Yo como pan",
        options=[("Yo", True), ("como", True), ("pan", True), ("bebo", False), ("agua", False)])

    _add_exercise(db, lesson3.id, order=3, type="fill_blank",
        prompt="Yo ___ agua  (I drink water)",
        correct_answer="bebo",
        options=[("bebo", True), ("como", False), ("tengo", False), ("quiero", False)])

    _add_exercise(db, lesson3.id, order=4, type="type_answer",
        prompt="Translate: 'the milk'",
        correct_answer="la leche")

    lesson4 = Lesson(skill_id=skill.id, order=2)
    db.add(lesson4)
    db.flush()

    _add_exercise(db, lesson4.id, order=1, type="multiple_choice",
        prompt="'El pollo' means...",
        correct_answer="The chicken",
        options=[("The chicken", True), ("The fish", False), ("The beef", False), ("The pork", False)])

    _add_exercise(db, lesson4.id, order=2, type="match_pairs",
        prompt="Match the food words",
        correct_answer="matched",
        pairs=[("Manzana", "Apple"), ("Pan", "Bread"), ("Leche", "Milk"), ("Agua", "Water")])

    _add_exercise(db, lesson4.id, order=3, type="type_answer",
        prompt="Translate: 'I eat chicken'",
        correct_answer="Yo como pollo")


# ──────────────────────────────────────────────
# Skill 3: Numbers
# ──────────────────────────────────────────────

def _seed_numbers(db: Session, skill: Skill) -> None:
    lesson5 = Lesson(skill_id=skill.id, order=1)
    db.add(lesson5)
    db.flush()

    _add_exercise(db, lesson5.id, order=1, type="multiple_choice",
        prompt="What is 'tres'?",
        correct_answer="Three",
        options=[("Three", True), ("Two", False), ("Four", False), ("Five", False)])

    _add_exercise(db, lesson5.id, order=2, type="type_answer",
        prompt="Translate: 'seven'",
        correct_answer="siete")

    _add_exercise(db, lesson5.id, order=3, type="fill_blank",
        prompt="Uno, dos, ___",
        correct_answer="tres",
        options=[("tres", True), ("cuatro", False), ("cinco", False), ("seis", False)])

    _add_exercise(db, lesson5.id, order=4, type="word_bank",
        prompt="Translate: 'I have five cats'",
        correct_answer="Yo tengo cinco gatos",
        options=[("Yo", True), ("tengo", True), ("cinco", True), ("gatos", True), ("perros", False), ("tres", False)])

    lesson6 = Lesson(skill_id=skill.id, order=2)
    db.add(lesson6)
    db.flush()

    _add_exercise(db, lesson6.id, order=1, type="multiple_choice",
        prompt="What is 'diez'?",
        correct_answer="Ten",
        options=[("Ten", True), ("Eight", False), ("Nine", False), ("Six", False)])

    _add_exercise(db, lesson6.id, order=2, type="match_pairs",
        prompt="Match the numbers",
        correct_answer="matched",
        pairs=[("Uno", "One"), ("Dos", "Two"), ("Tres", "Three"), ("Cuatro", "Four")])

    _add_exercise(db, lesson6.id, order=3, type="type_answer",
        prompt="Translate: 'eight'",
        correct_answer="ocho")


# ──────────────────────────────────────────────
# Skill 4: Family
# ──────────────────────────────────────────────

def _seed_family(db: Session, skill: Skill) -> None:
    lesson7 = Lesson(skill_id=skill.id, order=1)
    db.add(lesson7)
    db.flush()

    _add_exercise(db, lesson7.id, order=1, type="multiple_choice",
        prompt="'La madre' means...",
        correct_answer="The mother",
        options=[("The mother", True), ("The father", False), ("The sister", False), ("The brother", False)])

    _add_exercise(db, lesson7.id, order=2, type="word_bank",
        prompt="Translate: 'My father is tall'",
        correct_answer="Mi padre es alto",
        options=[("Mi", True), ("padre", True), ("es", True), ("alto", True), ("madre", False), ("baja", False)])

    _add_exercise(db, lesson7.id, order=3, type="fill_blank",
        prompt="Mi ___ es doctora  (My sister is a doctor)",
        correct_answer="hermana",
        options=[("hermana", True), ("hermano", False), ("padre", False), ("madre", False)])

    _add_exercise(db, lesson7.id, order=4, type="type_answer",
        prompt="Translate: 'the family'",
        correct_answer="la familia")

    lesson8 = Lesson(skill_id=skill.id, order=2)
    db.add(lesson8)
    db.flush()

    _add_exercise(db, lesson8.id, order=1, type="multiple_choice",
        prompt="'El hermano' means...",
        correct_answer="The brother",
        options=[("The brother", True), ("The sister", False), ("The cousin", False), ("The uncle", False)])

    _add_exercise(db, lesson8.id, order=2, type="match_pairs",
        prompt="Match the family words",
        correct_answer="matched",
        pairs=[("Madre", "Mother"), ("Padre", "Father"), ("Hermana", "Sister"), ("Hermano", "Brother")])

    _add_exercise(db, lesson8.id, order=3, type="type_answer",
        prompt="Translate: 'my mother'",
        correct_answer="mi madre")


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def _add_exercise(
    db: Session,
    lesson_id: int,
    order: int,
    type: str,
    prompt: str,
    correct_answer: str,
    options: list[tuple[str, bool]] | None = None,
    pairs: list[tuple[str, str]] | None = None,
) -> None:
    exercise = Exercise(
        lesson_id=lesson_id,
        type=type,
        prompt=prompt,
        correct_answer=correct_answer,
        order=order,
    )
    db.add(exercise)
    db.flush()

    if options:
        for text, is_correct in options:
            db.add(ExerciseOption(exercise_id=exercise.id, text=text, is_correct=is_correct))

    if pairs:
        for text, match_text in pairs:
            db.add(ExerciseOption(exercise_id=exercise.id, text=text, match_text=match_text))
