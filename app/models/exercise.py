from .db import db, environment, SCHEMA, add_prefix_for_prod

class Exercise(db.Model):
    __tablename__ = 'exercises'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    body_part = db.Column(db.String)
    category = db.Column(db.String)
    description = db.Column(db.String)
    image_url = db.Column(db.String)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'body_part': self.body_part,
            'category': self.category,
            'description': self.description,
            'image_url': self.image_url
        }
