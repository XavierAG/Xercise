from app.models import db, ExerciseRepetition, WorkoutExercise, Workout, environment, SCHEMA
from sqlalchemy.sql import text

def seed_exercise_repetitions():
    workout_exercise1 = WorkoutExercise.query.get(1).to_dict()
    workout_exercise2 = WorkoutExercise.query.get(2).to_dict()
    workout_exercise3 = WorkoutExercise.query.get(3).to_dict()

    rep1 = ExerciseRepetition(
        workout_exercise_id=workout_exercise1["workout_id"],
        exercise_id=workout_exercise1["exercise_id"],
        weight=100,
        repetitions=8
    )
    rep2 = ExerciseRepetition(
        workout_exercise_id=workout_exercise1["workout_id"],
        exercise_id=workout_exercise1["exercise_id"],
        weight=90.5,
        repetitions=8
    )
    rep3 = ExerciseRepetition(
        workout_exercise_id=workout_exercise2["workout_id"],
        exercise_id=workout_exercise2["exercise_id"],
        weight=80,
        repetitions=8
    )

    db.session.add(rep1)
    db.session.add(rep2)
    db.session.add(rep3)
    db.session.commit()
    test = Workout.query.get(1).to_dict()
    test2 = Workout.query.get(2).to_dict()
    print("TEST", test)
    print("TEST2", test2)


def undo_exercise_repetitions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.exercise_repetitions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM exercise_repetitions"))

    db.session.commit()
