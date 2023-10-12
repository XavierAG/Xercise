import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import * as workoutActions from "../../store/workouts";
import WorkoutModal from "../WorkoutModal";
import { useModal } from "../../context/Modal";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import "./EditWorkoutForm.css";

export default function EditWorkoutForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [name, setName] = useState("");
  const { closeModal } = useModal();
  const workout = useSelector((state) =>
    state.workout.singleWorkout ? state.workout.singleWorkout : {}
  );
  const history = useHistory();
  const { workoutId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(workoutActions.getWorkoutThunk(workoutId)).then(() =>
      setIsLoaded(true)
    );
  }, [dispatch]);

  useEffect(() => {
    if (workout) {
      setName(workout.name || "");
    }
  }, [workout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
    };

    const editedWorkout = await dispatch(
      workoutActions.editWorkoutThunk(workoutId, data)
    );
    history.push(`/workouts/${workoutId}`);
  };
  const deleteWorkout = () => {
    dispatch(workoutActions.deleteWorkoutThunk(workoutId));
    closeModal();
    history.push(`/workouts/`);
  };

  return (
    <div className="workout-detail-full">
      <button
        className="workouts-backtab"
        onClick={() => history.push(`/workouts/${workoutId}`)}
      >
        Cancel
      </button>
      <form
        className="workout-edit-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="workout-detail">
          <input
            className="workout-name-edit"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Workout Name"
          />

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
        <div>
          <button className="confirm-edit-workout" type="submit">
            Confirm
          </button>
          <OpenModalButton
            type="button"
            buttonText="DELETE"
            className="delete-workout-button"
            modalComponent={
              <div className="delete-modal-workout">
                <h1>Delete?</h1>
                <div className="delete-buttons-workout">
                  <button
                    className="cancel-delete-workout"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm-delete-workout"
                    onClick={deleteWorkout}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </form>
    </div>
  );
}
