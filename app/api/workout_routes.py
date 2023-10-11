from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Workout, ExerciseRepetition, db
from app.forms import WorkoutForm, ExerciseRepetitionForm
from datetime import datetime

workout_routes = Blueprint('workouts', __name__)

@workout_routes.route('/', methods=['GET'])
def get_all_workouts():
    workouts = Workout.query.filter_by(user_id=1).all()
    return {'workouts': [workout.to_dict() for workout in workouts]}


@workout_routes.route('/<int:workout_id>', methods=["GET"])
def get_workout_details(workout_id):
    workout = Workout.query.get(workout_id)
    if workout:
        workout_data = workout.to_dict()
        return {"workout": workout_data}

@workout_routes.route("/", methods=["POST"])
@login_required
def create_workout():
    # data = request.get_json()
    form = WorkoutForm()
    # form2 = ExerciseRepetitionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    # form2['csrf_token'].data = request.cookies['csrf_token']

    # if form.validate_on_submit() or form2.validate_on_submit():
    if form.validate_on_submit():
        current_time = datetime.utcnow()
        new_workout = Workout(
            name=form.data["name"],
            user_id=current_user.id,
            created_at=current_time,
        )
        db.session.add(new_workout)
        db.session.commit()
        # new_reps = ExerciseRepetition(
        #     workout_id=new_workout.id,
        #     exercise_id=data["repetition"]["exercise_id"],
        #     weight=data["repetition"]["weight"],
        #     repetitions=data["repetition"]["repetitions"]
        # )
        # db.session.add(new_reps)
        # db.session.commit()

        return new_workout.to_dict()
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400

@workout_routes.route('/<int:workout_id>', methods=["PUT"])
@login_required
def edit_workout(workout_id):
    form = WorkoutForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    workout = Workout.query.get(workout_id)

    if workout is None:
        return {"errors" : "Exercise not found"}, 404
    if form.validate_on_submit() and workout.user_id == current_user.id:
        workout.name = form.data["name"]
        db.session.commit()
        return workout.to_dict()
    elif workout.user_id != current_user.id:
        return {'message': 'User unauthorized to edit workout'}, 400
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400


@workout_routes.route('/<int:workout_id>', methods=["DELETE"])
@login_required
def delete_workout(workout_id):
    workout = Workout.query.get(workout_id)
    if workout is None:
        return {"errors": "Workout not found"}, 404
    if workout.user_id == current_user.id:
        db.session.delete(workout)
        db.session.commit()
        return {"message": "Workout successfully deleted"}
    elif workout.user_id != current_user.id:
        return {"message": "Must be workout owner to delete"}
# @workout_routes.route()

# if request.method == 'POST':
#         # Handle form submissions
#         form_type = request.form.get('form_type')
#         if form_type == 'form1':
#             # Process data from form1
#             pass
#         elif form_type == 'form2':
#             # Process data from form2
#             pass
#         elif form_type == 'form3':
#             # Process data from form3
#             pass
