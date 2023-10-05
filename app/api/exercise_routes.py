from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Exercise, db

exercise_routes = Blueprint('exercises', __name__)

@exercise_routes.route("/", methods=["GET"])
def get_all_exercises():
    exercises = Exercise.query.all()
    return {"exercises": [exercise.to_dict() for exercise in exercises]}
