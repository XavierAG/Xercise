from .db import db, environment, SCHEMA, add_prefix_for_prod

# workout_exercise = db.Table (
#     'workout_exercises',

#     db.Model.metadata,
#     db.Column('workout_id', db.Integer, db.ForeignKey(add_prefix_for_prod('workouts.id'),
#         primary_key=True)),
#     db.Column('exercise_id', db.Integer, db.ForeignKey(add_prefix_for_prod('exercises.id'),
#         primary_key=True))
# )

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
    exercise = db.relationship('Exercise', foreign_keys=[exercise_id], back_populates='workout_exercises')

    exercise_repetitions = db.relationship('ExerciseRepetition', back_populates='workout_exercise', cascade="all, delete")

    def to_dict(self):
        exercise_reps = [rep.to_dict() for rep in self.exercise_repetitions]
        return {
            "workout_id": self.workout_id,
            "exercise_id": self.exercise_id,
            "exercise_reps": exercise_reps,
        }
