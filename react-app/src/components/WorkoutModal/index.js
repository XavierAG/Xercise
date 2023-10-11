import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as exerciseActions from "../../store/exercises";
import { useModal } from "../../context/Modal";
import { getWorkoutsThunk, postWorkoutThunk } from "../../store/workouts";
import { postExerciseRepetitions } from "../../store/reps";

export default function WorkoutModal() {
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const allExercises = useSelector((state) =>
    state.exercise.allExercises ? state.exercise.allExercises : {}
  );
  const exercises = Object.values(allExercises);
  const [isLoaded, setIsLoaded] = useState(false);

  const [repetitions, setRepetitions] = useState([]);
  const handleAddRepetition = () => {
    setRepetitions([
      ...repetitions,
      { exercise_id: "", weight: "", repetitions: "" },
    ]);
  };
  useEffect(() => {
    dispatch(exerciseActions.getExercisesThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRepetitions = [...repetitions];
    updatedRepetitions[index][name] = value;
    setRepetitions(updatedRepetitions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
    };

    const createdWorkout = await dispatch(postWorkoutThunk(data));
    if (createdWorkout) {
      let rep;
      console.log("CREATED WORK", createdWorkout);
      for (rep of repetitions) {
        console.log("REPS", rep);
        const repdata = {
          workout_id: createdWorkout.id,
          exercise_id: rep.exercise_id,
          weight: rep.weight,
          repetitions: rep.repetitions,
        };
        console.log("REPDATA", repdata);
        dispatch(postExerciseRepetitions(repdata));
      }
      dispatch(getWorkoutsThunk());
      closeModal();
    }
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
        {repetitions.map((repetition, index) => (
          <div key={index}>
            <select
              name="exercise_id"
              value={repetition.exercise_id}
              onChange={(e) => handleInputChange(index, e)}
            >
              <option value="">Select an exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={repetition.weight}
              onChange={(e) => handleInputChange(index, e)}
            />
            <input
              type="number"
              name="repetitions"
              placeholder="Repetitions"
              value={repetition.repetitions}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
        ))}
        <button className="create-workout-button" type="submit">
          Create
        </button>
      </form>
      <button onClick={handleAddRepetition}>Add Repetition</button>
    </div>
  );
}
