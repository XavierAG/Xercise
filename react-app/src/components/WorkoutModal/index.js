import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { getWorkoutsThunk, postWorkoutThunk } from "../../store/workouts";

export default function WorkoutModal() {
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
    };

    const createdWorkout = await dispatch(postWorkoutThunk(data));
    dispatch(getWorkoutsThunk());
    closeModal();
  };

  return (
    <div>
      <h2>Create Workout</h2>
      <form onSubmit={handleSubmit}>
        <div className="workout-name">
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Workout Name"
          />
          <div className="error-container">
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
        </div>
        <button className="create-workout-button" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
