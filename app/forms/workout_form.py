from flask_wtf import FlaskForm
from wtforms import StringField, DateTimeField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Workout

class WorkoutForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=100)])
    created_at = DateTimeField('Created At')
