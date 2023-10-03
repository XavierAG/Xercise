from .db import db, environment, SCHEMA, add_prefix_for_prod

class Workout(db.Model):
    __tablename__ = 'workouts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    name = db.Column(db.String)
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('exercises.id')))
    sets = db.Column(db.Integer)
    repetitions = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    created_at = db.Column(db.TIMESTAMP)

    exercises = db.relationship('Exercise', back_populates='workouts')
    user = db.relationship('User', back_populates='workouts')

    def to_dict(self):
        return {
            "id": self.id,
            'user_id': self.user_id,
            'name': self.name,
            'exercise_id': self.exercise_id,
            'sets': self.sets,
            'repetitions': self.repetitions,
            'weight': self.weight,
            'created_at': self.created_at.isoformat(),
            'exercises': self.exercises.to_dict() if self.exercises else None
        }
