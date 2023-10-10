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
    <div>
      <div className="create-workout-button">
        <OpenModalButton
          className="create-workout"
          buttonText="CREATE WORKOUT"
          modalComponent={<WorkoutModal />}
        />
      </div>
      {workouts.length &&
        workouts.map((workout) => (
          <div className="workout-container">
            <OpenModalButton
              className="workout-view-modal"
              buttonText={
                <div className="top-car-workouts">
                  <h1>{workout.name}</h1>
                  <OpenModalButton
                    className="view-workout"
                    buttonText="..."
                    modalComponent={<WorkoutModal />}
                  />
                </div>
              }
            />
            {workout.workout_exercises &&
              workout.workout_exercises.map((rep) => (
                <div>
                  <p>{rep.exercise_name}</p>
                  <p>{rep.weight}</p>
                  <p>{rep.repetitions}</p>
                </div>
              ))}
            <p>{workout.created_at}</p>
          </div>
        ))}
    </div>
  );
}
