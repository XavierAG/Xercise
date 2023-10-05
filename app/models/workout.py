from .db import db, environment, SCHEMA, add_prefix_for_prod

class Workout(db.Model):
    __tablename__ = 'workouts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    name = db.Column(db.String)
    created_at = db.Column(db.TIMESTAMP)

    users = db.relationship('User', back_populates='workouts')
    workout_exercises = db.relationship('WorkoutExercise', back_populates='workout', cascade="all, delete")

    def to_dict(self):
        created_at_iso = self.created_at.isoformat() if self.created_at else None
        filtered_workout_exercises = [we.to_dict() for we in self.workout_exercises if we.workout_id == self.id]
        return {
            "id": self.id,
            'user_id': self.user_id,
            'name': self.name,
            'created_at': created_at_iso,
            'workout_exercises': filtered_workout_exercises
        }
