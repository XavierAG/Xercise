from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import WorkoutExercise

class WorkoutExerciseForm(FlaskForm):
