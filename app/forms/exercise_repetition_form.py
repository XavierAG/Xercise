from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import ExerciseRepetition

class ExerciseRepetitionForm(FlaskForm):
    weight = IntegerField('Weight', valdators=[DataRequired()])
    repetitions = IntegerField('Repetitions', valdators=[DataRequired()])
