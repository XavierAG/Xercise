from .db import db, environment, SCHEMA, add_prefix_for_prod

class ExerciseRepetition(db.Model):
    __tablename__ = 'exercise_repetitions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    workout_exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workout_exercises.id')))
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('exercises.id')))
    weight = db.Column(db.Float)  # You may want to use Float or Decimal for weight
    repetitions = db.Column(db.Integer)

    exercise = db.relationship('Exercise', foreign_keys=[exercise_id], back_populates='exercise_repetitions')
    workout_exercise = db.relationship('WorkoutExercise', back_populates='exercise_repetitions')

    def to_dict(self):
        return {
            "id": self.id,
            "workout_exercise_id": self.workout_exercise_id,
            "weight": self.weight,
            "repetitions": self.repetitions
        }
