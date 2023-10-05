from app.models import db, Workout, User, environment, SCHEMA
from datetime import datetime
from sqlalchemy.sql import text

def seed_workouts():
    created_at = datetime.now()

    workout1 = Workout(
        name="Morning Workout",
        user_id=1,
        created_at=created_at
    )
    workout2 = Workout(
        name="Midday Workout",
        user_id=2,
        created_at=created_at
    )
    workout3 = Workout(
        name="Evening Workout",
        user_id=1,
        created_at=created_at
    )

    db.session.add(workout1)
    db.session.add(workout2)
    db.session.add(workout3)
    db.session.commit()

def undo_workouts():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.workouts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM workouts"))

    db.session.commit()
