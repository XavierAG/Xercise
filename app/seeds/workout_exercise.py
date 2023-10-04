from app.models import db, WorkoutExercise, Workout, Exercise, environment, SCHEMA
from sqlalchemy.sql import text

def seed_workout_exercises():
    workout1 = Workout.query.get(1)
    workout2 = Workout.query.get(2)
    workout3 = Workout.query.get(3)

    exercise1 = Exercise.query.get(1)
    exercise2 = Exercise.query.get(2)
    exercise3 = Exercise.query.get(3)

    workout_exercise1 = WorkoutExercise(workout=workout1, exercise=exercise1)
    workout_exercise2 = WorkoutExercise(workout=workout1, exercise=exercise2)
    workout_exercise3 = WorkoutExercise(workout=workout1, exercise=exercise3)
    workout_exercise4 = WorkoutExercise(workout=workout2, exercise=exercise1)
    workout_exercise5 = WorkoutExercise(workout=workout2, exercise=exercise2)
    workout_exercise6 = WorkoutExercise(workout=workout3, exercise=exercise3)

    db.session.add(workout_exercise1)
    db.session.add(workout_exercise2)
    db.session.add(workout_exercise3)
    db.session.add(workout_exercise4)
    db.session.add(workout_exercise5)
    db.session.add(workout_exercise6)

    db.session.commit()

def undo_workout_exercises():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.workout_exercises RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM workout_exercises"))

    db.session.commit()
