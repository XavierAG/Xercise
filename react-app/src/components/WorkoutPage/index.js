import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./WorkoutPage.css";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import * as workoutActions from "../../store/workouts";
import WorkoutModal from "../WorkoutModal";

export default function WorkoutPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const allWorkouts = useSelector((state) =>
    state.workout.allWorkouts ? state.workout.allWorkouts : {}
  );
  const workouts = Object.values(allWorkouts);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(workoutActions.getWorkoutsThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="workouts-container-full">
      <div className="create-workout-button">
        <OpenModalButton
          className="create-workout"
          buttonText="CREATE NEW WORKOUT"
          modalComponent={<WorkoutModal />}
        />
      </div>
      <div className="workouts-container">
        {workouts.length &&
          workouts.map((workout) => (
            <NavLink
              className="nav-to-workout"
              exact
              to={`/workouts/${workout.id}`}
            >
              <div className="top-card-workouts">
                <h1>{workout.name}</h1>
              </div>
              <p>{workout.created_at}</p>
              <div className="workout-top-bar-main">
                <p className="workout-name-main">name</p>
                <p className="workout-weight-main">lbs</p>
                <p className="workout-reps-main">reps</p>
              </div>
              {workout.workout_exercises &&
                workout.workout_exercises.map((rep) => (
                  <div className="workout-ex-detail-main">
                    <p className="workout-name-main">{rep.exercise_name}</p>
                    <p className="workout-weight-main">{rep.weight}</p>
                    <p className="workout-reps-main">{rep.repetitions}</p>
                  </div>
                ))}
            </NavLink>
          ))}
      </div>
    </div>
  );
}
