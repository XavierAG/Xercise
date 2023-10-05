from .db import db, environment, SCHEMA, add_prefix_for_prod
from .exercise import Exercise

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
        exercise_reps_by_exercise = {}
        for rep in self.exercise_repetitions:
            exercise_id = rep.exercise_id
            if exercise_id not in exercise_reps_by_exercise:
                exercise_reps_by_exercise[exercise_id] = []
            exercise_reps_by_exercise[exercise_id].append(rep.to_dict())

    # Create a list of exercise dictionaries
        exercise_list = []
        for exercise_id, exercise_reps in exercise_reps_by_exercise.items():
            exercise_name = Exercise.query.get(exercise_id).to_dict()
            exercise_list.append({
                "exercise_name": exercise_name['name'],
                "exercise_reps": exercise_reps,
            })
        return exercise_list
