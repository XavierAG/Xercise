from .db import db, environment, SCHEMA, add_prefix_for_prod
from .exercise import Exercise

class ExerciseRepetition(db.Model):
    __tablename__ = 'exercise_repetitions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workouts.id')))
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('exercises.id')))
    weight = db.Column(db.Float)
    repetitions = db.Column(db.Float)

    exercise = db.relationship('Exercise', foreign_keys=[exercise_id], back_populates='exercise_repetitions')
    workout = db.relationship('Workout', back_populates='exercise_repetitions')

    def to_dict(self):
        exercise = Exercise.query.get(self.exercise_id)
        ex_name = exercise.name
        return {
            "id": self.id,
            "workout_id": self.workout_id,
            "exercise_name": ex_name,
            "exercise_id": self.exercise_id,
            "weight": self.weight,
            "repetitions": self.repetitions
        }
