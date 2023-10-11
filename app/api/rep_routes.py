from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Workout, ExerciseRepetition, db
from app.forms import WorkoutForm, ExerciseRepetitionForm
from datetime import datetime

rep_routes = Blueprint('reps', __name__)

@rep_routes.route("/exercise-repetitions", methods=["POST"])
def create_exercise_reps():
    form = ExerciseRepetitionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_rep = ExerciseRepetition(
            workout_id=form.data["workout_id"],
            exercise_id=form.data["exercise_id"],
            weight=form.data["weight"],
            repetitions=form.data["repetitions"]
        )
        db.session.add(new_rep)
        db.session.commit()
        return new_rep.to_dict()
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400
