from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField
from wtforms.validators import DataRequired, Email, ValidationError
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.models import Exercise
from app.routes.aws_helpers import ALLOWED_EXTENSIONS
from app.utils.exercise_info import exercise_categories, body_part

class ExerciseForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(max=60)])
    body_part =  SelectField('Body Part', choices=body_part)
    category = SelectField('Category', choices=exercise_categories)
    description = StringField('Description', validators=[ Length(max=200)])
    image_url = FileField("Image File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
