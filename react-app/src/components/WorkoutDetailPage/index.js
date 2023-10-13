import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import * as workoutActions from "../../store/workouts";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import "./WorkoutDetailPage.css";
import { OpenModalButton } from "../OpenModalButton";

export default function WorkoutDetailPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const workout = useSelector((state) =>
    state.workout.singleWorkout ? state.workout.singleWorkout : {}
  );
  const { workoutId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(workoutActions.getWorkoutThunk(workoutId)).then(() =>
      setIsLoaded(true)
    );
  }, [dispatch]);

  return (
    <div className="workout-detail-full">
      <a className="side-workout-page" href="/workouts">
        Workouts
      </a>
      <div className="workout-detail">
        <h1>{workout.name}</h1>
        <p>{workout.created_at}</p>
        <div className="workout-top-bar">
          <p className="workout-name">name</p>
          <p className="workout-weight">lbs</p>
          <p className="workout-reps">reps</p>
        </div>
        {workout.workout_exercises &&
          workout.workout_exercises.map((rep) => (
            <div className="workout-ex-detail">
              <p className="workout-name">{rep.exercise_name}</p>
              <p className="workout-weight">{rep.weight}</p>
              <p className="workout-reps">{rep.repetitions}</p>
            </div>
          ))}
      </div>
      <a className="side-workout-page" href={`/workouts/${workoutId}/edit`}>
        Edit
      </a>
    </div>
  );
}
