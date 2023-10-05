from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField
from wtforms.validators import DataRequired, Length, ValidationError
from app.models import Workout

class WorkoutForm(FlaskForm):
    name = StringField('Name', valdators=[DataRequired(), Length(max=100)])
