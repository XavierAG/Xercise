from .db import db, environment, SCHEMA, add_prefix_for_prod

class Template(db.Model):
    __tablename__ = 'templates'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('exercises.id')))
    sets = db.Column(db.Integer)
    repetitions = db.Column(db.Integer)
    weight = db.Column(db.Integer)
    private = db.Column(db.Boolean)

    def to_dict(self):
        return {
            'id': self.id,
            'exercise_id': self.exercise_id,
            'sets': self.sets,
            'repetitions': self.repetitions,
            'weight': self.weight,
            'private': self.private,
            'exercise': self.exercise.to_dict() if self.exercise else None
        }
