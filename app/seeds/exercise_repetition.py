from app.models import db, ExerciseRepetition, WorkoutExercise, Workout, environment, SCHEMA
from sqlalchemy.sql import text

def seed_exercise_repetitions():
    workout_exercise1 = WorkoutExercise.query.get(1).to_dict()
    workout_exercise2 = WorkoutExercise.query.get(2).to_dict()
    workout_exercise3 = WorkoutExercise.query.get(3).to_dict()

    rep1 = ExerciseRepetition(
        workout_exercise_id=1,
        exercise_id=1,
        weight=100,
        repetitions=8
    )
    rep2 = ExerciseRepetition(
        workout_exercise_id=1,
        exercise_id=1,
        weight=90.5,
        repetitions=8
    )
    rep3 = ExerciseRepetition(
        workout_exercise_id=1,
        exercise_id=1,
        weight=80,
        repetitions=8
    )
    rep4 = ExerciseRepetition(
        workout_exercise_id=1,
        exercise_id=2,
        weight=60,
        repetitions=8
    )
    rep5 = ExerciseRepetition(
        workout_exercise_id=1,
        exercise_id=2,
        weight=55,
        repetitions=8
    )
    rep6 = ExerciseRepetition(
        workout_exercise_id=5,
        exercise_id=2,
        weight=55,
        repetitions=8
    )
    rep7 = ExerciseRepetition(
        workout_exercise_id=4,
        exercise_id=1,
        weight=60,
        repetitions=8
    )
    rep8 = ExerciseRepetition(
        workout_exercise_id=4,
        exercise_id=1,
        weight=55,
        repetitions=8
    )
    rep9 = ExerciseRepetition(
        workout_exercise_id=4,
        exercise_id=1,
        weight=55,
        repetitions=8
    )

    db.session.add(rep1)
    db.session.add(rep2)
    db.session.add(rep3)
    db.session.add(rep4)
    db.session.add(rep5)
    db.session.add(rep6)
    db.session.add(rep7)
    db.session.add(rep8)
    db.session.add(rep9)
    db.session.commit()


def undo_exercise_repetitions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.exercise_repetitions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM exercise_repetitions"))

    db.session.commit()
