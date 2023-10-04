from .db import db, environment, SCHEMA, add_prefix_for_prod

class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercises'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('workouts.id')))
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('exercises.id')))
    # sets = db.Column(db.Integer)
    # repetitions = db.Column(db.Integer)
    # weight = db.Column(db.Integer)

    workout = db.relationship('Workout', back_populates='workout_exercises')
    exercise = db.relationship('Exercise', back_populates='workout_exercises')
    exercise_repetitions = db.relationship('ExerciseRepetition', back_populates='workout_exercise')

    def to_dict(self):
        exercise_reps = [rep.to_dict() for rep in self.exercise_repetitions]
        return {
            "exercise_reps": exercise_reps
        }
