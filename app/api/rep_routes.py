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

@rep_routes.route('/<int:rep_id>', methods=["PUT"])
@login_required
def edit_rep(rep_id):
    form = ExerciseRepetitionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    rep = ExerciseRepetition.query.get(rep_id)

    if rep is None:
        return {"errors" : "Rep not found"}, 404
    if form.validate_on_submit():
        rep.weight = form.data["weight"]
        rep.repetitions = form.data["repetitions"]
        db.session.commit()
        return rep.to_dict()
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400
