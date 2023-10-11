from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import ExerciseRepetition

class ExerciseRepetitionForm(FlaskForm):
    workout_id = IntegerField('Workout_id', validators=[DataRequired()])
    exercise_id = IntegerField('Exercise_id', validators=[DataRequired()])
    weight = IntegerField('Weight', validators=[DataRequired()])
    repetitions = IntegerField('Repetitions', validators=[DataRequired()])
