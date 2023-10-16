from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, DecimalField
from wtforms.validators import DataRequired, Email, ValidationError, NumberRange
from app.models import ExerciseRepetition

class ExerciseRepetitionForm(FlaskForm):
    workout_id = IntegerField('Workout_id', validators=[DataRequired()])
    exercise_id = IntegerField('Exercise_id', validators=[DataRequired()])
    weight = DecimalField('Weight', validators=[DataRequired(), NumberRange(min=0)])
    repetitions = DecimalField('Repetitions', validators=[DataRequired(), NumberRange(min=0)])
