from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Exercise, db
from app.forms import ExerciseForm
from app.routes.aws_helpers import (
    upload_file_to_s3, get_unique_filename)

exercise_routes = Blueprint('exercises', __name__)

@exercise_routes.route("/", methods=["GET"])
def get_all_exercises():
    exercises = Exercise.query.all()
    return {"exercises": [exercise.to_dict() for exercise in exercises]}

@exercise_routes.route("/<int:exercise_id>", methods=["GET"])
def get_exercise_details(exercise_id):
    exercise = Exercise.query.get(exercise_id)
    if exercise:
        exercise_data = exercise.to_dict()
        return {"exercise": exercise_data}

@exercise_routes.route("/", methods=["POST"])
def create_exercise():
    form = ExerciseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        url = None
        image_url=form.data["image_url"]
        if image_url:
            image_url.filename = get_unique_filename(image_url.filename)
            upload = upload_file_to_s3(image_url)

            if "url" not in upload:
                errors = [upload]
                return {'errors': errors}, 400

            url = upload["url"]
        new_exercise = Exercise(
            name=form.data["name"],
            body_part=form.data["body_part"],
            category=form.data["category"],
            description=form.data["description"],
            image_url=url,
            owner_id=current_user.id,
        )
        db.session.add(new_exercise)
        db.session.commit()

        return new_exercise.to_dict()
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400

@exercise_routes.route('/<int:exercise_id>', methods=["PUT"])
@login_required
def edit_exercise(exercise_id):
    form = ExerciseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    exercise = Exercise.query.get(exercise_id)

    if exercise is None:
        return {"errors" : "Exercise not found"}, 404

    if form.validate_on_submit() and exercise.owner_id == current_user.id:

        image_url=form.data["image_url"]
        if image_url:
            image_url.filename = get_unique_filename(image_url.filename)
            upload = upload_file_to_s3(image_url)
            print("image upload", upload)

            if "url" not in upload:
                errors = [upload]
                return {'errors': errors}, 400

            url = upload["url"]
            exercise.image_url = url

        exercise.name = form.data["name"]
        exercise.body_part=form.data["body_part"]
        exercise.category=form.data["category"]
        exercise.description=form.data["description"]

        db.session.commit()

        return exercise.to_dict()
    elif exercise.owner_id != current_user.id:
        return {'message': 'User unauthorized to edit exercise'}, 400
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400

@exercise_routes.route('/<int:exercise_id>', methods=["DELETE"])
@login_required
def delete_exercise(exercise_id):

    exercise = Exercise.query.get(exercise_id)
    if exercise is None:
        return {"errors" : "Exercise not found"}, 404

    if exercise.owner_id == current_user.id:
        db.session.delete(exercise)
        db.session.commit()
        return { "message": "Exercise successfully deleted"}
    elif exercise.owner_id != current_user.id:
        return {"message": "Must be exercise owner to delete"}
