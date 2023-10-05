from app.models import db, Exercise, environment, SCHEMA
from sqlalchemy.sql import text

def seed_exercises():
    exercise1 = Exercise(
        name="bench press", body_part="chest", category="barbell", description="During a bench press, you lower the weight down to chest level and then press upwards while extending your arms", image_url="https://www.inspireusafoundation.org/wp-content/uploads/2022/04/barbell-bench-press.gif", owner_id=1
    )
    exercise2 = Exercise(
        name="inlcine bench press", body_part="chest", category="barbell", description="During an incline bench press, you lower the weight down to chest level and then press upwards while extending your arms", image_url="https://www.inspireusafoundation.org/wp-content/uploads/2022/05/incline-barbell-bench-press.gif", owner_id=1
    )
    exercise3 = Exercise(
        name="bench press", body_part="chest", category="dumbbell", description="During a bench press, you lower the weight down to chest level and then press upwards while extending your arms", image_url="https://newlife.com.cy/wp-content/uploads/2019/11/03011301-Dumbbell-Decline-Bench-Press_Chest_360.gif", owner_id=1
    )

    db.session.add(exercise1)
    db.session.add(exercise2)
    db.session.add(exercise3)
    db.session.commit()

def undo_exercises():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.exercises RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM exercises"))

    db.session.commit()
