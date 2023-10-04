from .db import db, environment, SCHEMA, add_prefix_for_prod

follows = db.Table (
    'followers',

    db.Model.metadata,
    db.Column('follower_id',db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'))),
    db.Column('followed_id',db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
)

if environment == "production":
    friends.schema = SCHEMA
