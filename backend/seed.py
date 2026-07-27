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

    # --- Unit 1 ---
    unit1 = Unit(
        language_id=language.id,
        title="Basics",
        description="Learn the fundamentals of Spanish",
        order=1,
    )
    db.add(unit1)

    # --- Unit 2 ---
    unit2 = Unit(
        language_id=language.id,
        title="Conversations",
        description="Master everyday travel and dialogue",
        order=2,
    )
    db.add(unit2)
    db.flush()

    # --- Skills for Unit 1 ---
    skills_data_u1 = [
        ("Greetings", "👋", 1),
        ("Food", "🍕", 2),
        ("Numbers", "🔢", 3),
        ("Family", "👨‍👩‍👧", 4),
    ]
    skills_u1 = []
    for title, icon, order in skills_data_u1:
        skill = Skill(unit_id=unit1.id, title=title, icon=icon, order=order)
        db.add(skill)
        skills_u1.append(skill)

    # --- Skills for Unit 2 ---
    skills_data_u2 = [
        ("Travel", "✈️", 1),
        ("Phrases", "💬", 2),
    ]
    skills_u2 = []
    for title, icon, order in skills_data_u2:
        skill = Skill(unit_id=unit2.id, title=title, icon=icon, order=order)
        db.add(skill)
        skills_u2.append(skill)
    db.flush()

    # --- Lessons & Exercises for Unit 1 ---
    _seed_greetings(db, skills_u1[0])
    _seed_food(db, skills_u1[1])
    _seed_numbers(db, skills_u1[2])
    _seed_family(db, skills_u1[3])

    # --- Lessons & Exercises for Unit 2 ---
    _seed_travel(db, skills_u2[0])
    _seed_phrases(db, skills_u2[1])

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
# Skill 5: Travel
# ──────────────────────────────────────────────

def _seed_travel(db: Session, skill: Skill) -> None:
    lesson9 = Lesson(skill_id=skill.id, order=1)
    db.add(lesson9)
    db.flush()

    _add_exercise(db, lesson9.id, order=1, type="multiple_choice",
        prompt="'El hotel' means...",
        correct_answer="The hotel",
        options=[("The hotel", True), ("The airport", False), ("The taxi", False), ("The museum", False)])

    _add_exercise(db, lesson9.id, order=2, type="word_bank",
        prompt="Translate: 'Where is the passport?'",
        correct_answer="¿Dónde está el pasaporte?",
        options=[("¿Dónde", True), ("está", True), ("el", True), ("pasaporte?", True), ("tengo", False), ("como", False)])

    _add_exercise(db, lesson9.id, order=3, type="type_answer",
        prompt="Translate: 'a taxi'",
        correct_answer="un taxi")

    lesson10 = Lesson(skill_id=skill.id, order=2)
    db.add(lesson10)
    db.flush()

    _add_exercise(db, lesson10.id, order=1, type="match_pairs",
        prompt="Match the travel terms",
        correct_answer="matched",
        pairs=[("Hotel", "Hotel"), ("Taxi", "Taxi"), ("Boleto", "Ticket"), ("Maleta", "Suitcase")])

    _add_exercise(db, lesson10.id, order=2, type="fill_blank",
        prompt="Necesito un ___  (I need a ticket)",
        correct_answer="boleto",
        options=[("boleto", True), ("pasaporte", False), ("hotel", False), ("taxi", False)])


# ──────────────────────────────────────────────
# Skill 6: Phrases
# ──────────────────────────────────────────────

def _seed_phrases(db: Session, skill: Skill) -> None:
    lesson11 = Lesson(skill_id=skill.id, order=1)
    db.add(lesson11)
    db.flush()

    _add_exercise(db, lesson11.id, order=1, type="multiple_choice",
        prompt="'Lo siento' means...",
        correct_answer="I'm sorry",
        options=[("I'm sorry", True), ("Thank you", False), ("Excuse me", False), ("You're welcome", False)])

    _add_exercise(db, lesson11.id, order=2, type="type_answer",
        prompt="Translate: 'Excuse me'",
        correct_answer="Con permiso")

    lesson12 = Lesson(skill_id=skill.id, order=2)
    db.add(lesson12)
    db.flush()

    _add_exercise(db, lesson12.id, order=1, type="word_bank",
        prompt="Translate: 'Speak slower, please'",
        correct_answer="Hable más despacio por favor",
        options=[("Hable", True), ("más", True), ("despacio", True), ("por", True), ("favor", True), ("gracias", False)])

    _add_exercise(db, lesson12.id, order=2, type="match_pairs",
        prompt="Match common phrases",
        correct_answer="matched",
        pairs=[("De nada", "You're welcome"), ("Lo siento", "I'm sorry"), ("Disculpe", "Excuse me"), ("Salud", "Cheers")])


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
