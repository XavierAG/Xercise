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
import { editRepThunk } from "../../store/reps";

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
  const [editRep, setEditRep] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editNameBut, setEditNameBut] = useState(false);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [exId, setExId] = useState("");
  const [selectedRep, setSelectedRep] = useState(0);

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
    if (editedWorkout) {
      history.push(`/workouts/${workoutId}`);
    }
  };
  const handleRepSubmit = async (e) => {
    e.preventDefault();
    const data = {
      workout_id: workoutId,
      exercise_id: exId,
      weight: weight,
      repetitions: reps,
    };

    const editedRep = await dispatch(editRepThunk(selectedRep, data));
    if (editedRep) {
      history.push(`/workouts/${workoutId}/edit`);
      setEditRep(false);
      setSelectedRep(0);
      dispatch(workoutActions.getWorkoutThunk(workoutId));
    }
  };
  const deleteWorkout = () => {
    dispatch(workoutActions.deleteWorkoutThunk(workoutId));
    closeModal();
    history.push(`/workouts/`);
  };
  const handleEditRep = () => {
    setEditRep(true);
  };
  const handleEditName = () => {
    setEditName(true);
  };
  const handleSelectedRep = (id) => {
    setSelectedRep(id);
  };
  const hideEditName = () => {
    setEditNameBut(true);
  };

  return (
    <div className="workout-detail-full">
      <button
        className="workouts-backtab"
        onClick={() => history.push(`/workouts/${workoutId}`)}
      >
        Exit
      </button>
      <div className="workout-detail">
        <form
          className="workout-edit-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {editName ? (
            <div className="name-edit-div">
              <input
                className="workout-name-edit"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Workout Name"
              />
              <button type="submit" className="confirm-name-workout">
                <i class="fas fa-check"></i>
              </button>
            </div>
          ) : (
            <h1>{name}</h1>
          )}
          {editNameBut ? (
            <></>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleEditName();
                hideEditName();
              }}
              className="edit-name-workout"
            >
              <i className="fas fa-pen"></i>
            </button>
          )}
        </form>

        <p>{workout.created_at}</p>
        <div className="workout-top-bar">
          <p className="workout-name">name</p>
          <p className="workout-weight">lbs</p>
          <p className="workout-reps">reps</p>
        </div>
        {workout.workout_exercises &&
          workout.workout_exercises.map((rep) => (
            <div>
              {editRep && selectedRep === rep.id ? (
                <div>
                  <div className="workout-ex-detail">
                    <p className="workout-name">{rep.exercise_name}</p>
                    <form
                      className="rep-edit-form"
                      onSubmit={handleRepSubmit}
                      encType="multipart/form-data"
                    >
                      <div className="weight-edit">
                        <input
                          type="number"
                          min={0.01}
                          step="any"
                          name="weight"
                          placeholder="Weight"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                        />
                      </div>
                      <div className="rep-edit">
                        <input
                          type="number"
                          min={1}
                          name="repetitions"
                          placeholder="Reps"
                          value={reps}
                          onChange={(e) => setReps(e.target.value)}
                        />
                      </div>
                      <button className="confirm-edit-rep" type="submit">
                        <i class="fas fa-check"></i>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="workout-ex-detail">
                    <p className="workout-name">{rep.exercise_name}</p>
                    <p className="workout-weight">{rep.weight}</p>
                    <p className="workout-reps">{rep.repetitions}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleEditRep();
                      handleSelectedRep(rep.id);
                      setReps(rep.repetitions);
                      setWeight(rep.weight);
                      setExId(rep.exercise_id);
                    }}
                    className="edit-rep"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      <div>
        <OpenModalButton
          type="button"
          buttonText="DELETE"
          className="delete-workout-button"
          modalComponent={
            <div className="delete-modal-workout">
              <h1>Delete?</h1>
              <div className="delete-buttons-workout">
                <button className="cancel-delete-workout" onClick={closeModal}>
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
    </div>
  );
}
