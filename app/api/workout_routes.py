from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Workout, db

workout_routes = Blueprint('workouts', __name__)

@workout_routes.route('/<int:user_id>', methods=['GET'])
def get_all_workouts(user_id):
    workouts = Workout.query.filter_by(user_id=user_id).all()
    return {'workouts': [workout.to_dict() for workout in workouts]}


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
