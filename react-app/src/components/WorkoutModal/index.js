import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as exerciseActions from "../../store/exercises";
import { useModal } from "../../context/Modal";
import { getWorkoutsThunk, postWorkoutThunk } from "../../store/workouts";
import { postExerciseRepetitions } from "../../store/reps";
import "./WorkoutModal.css";

export default function WorkoutModal() {
  const { closeModal } = useModal();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [i, setI] = useState(0);
  const [addExercises, setAddExercises] = useState([]);
  const [singleExercise, setSingleExercise] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const allExercises = useSelector((state) =>
    state.exercise.allExercises ? state.exercise.allExercises : {}
  );
  const [showExerciseOptions, setShowExerciseOptions] = useState(false);
  const exercises = Object.values(allExercises);
  const [isLoaded, setIsLoaded] = useState(false);

  const [repetitions, setRepetitions] = useState([]);
  const [iMap, setIMap] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  useEffect(() => {
    if (selectedExercise) {
      setI(iMap[selectedExercise] || 0);
    }
  }, [selectedExercise, iMap]);

  const handleAddSet = ({ id, i }) => {
    setIMap((prevMap) => ({
      ...prevMap,
      [id]: i + 1,
    }));
    console.log("WHAT NOW", iMap);
    setRepetitions([
      ...repetitions,
      { exercise_id: id, weight: "", repetitions: "", newIndex: i },
    ]);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise.target.value);
  };
  const handleExerciseSelectagain = (exercise) => {
    setSelectedExercise(exercise);
  };

  useEffect(() => {
    dispatch(exerciseActions.getExercisesThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const handleAddExercise = () => {
    setShowExerciseOptions(true);
  };

  const pickedExercise = async (e) => {
    setShowExerciseOptions(false);
    const selectedValue = e.target.value;
    setSingleExercise(selectedValue);
    addExerciseToWorkout(selectedValue);
  };
  const addExerciseToWorkout = (e) => {
    setAddExercises([...addExercises, { exercise_id: e }]);
  };

  const handleInputChange = (workoutId, exerciseId, repetitionIndex, event) => {
    const { name, value } = event.target;
    const updatedRepetitions = [...repetitions];
    const repetitionToUpdate = updatedRepetitions.find(
      (repetition) =>
        repetition.exercise_id === exerciseId &&
        repetition.newIndex === repetitionIndex
    );

    if (repetitionToUpdate) {
      repetitionToUpdate[name] = value;
      const updatedReps = [...repetitions];
      setRepetitions(updatedReps);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: name,
    };

    const createdWorkout = await dispatch(postWorkoutThunk(data));
    if (createdWorkout) {
      let rep;
      for (rep of repetitions) {
        const repdata = {
          workout_id: createdWorkout.id,
          exercise_id: rep.exercise_id,
          weight: rep.weight,
          repetitions: rep.repetitions,
        };
        dispatch(postExerciseRepetitions(repdata));
      }
      dispatch(getWorkoutsThunk());
      closeModal();
    }
  };

  return (
    <div className="workout-modal-full">
      <div>
        <h2>Create Workout</h2>
      </div>

      <form className="workout-modal-form" onSubmit={handleSubmit}>
        <div className="workout-name-page">
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
        <div>
          {addExercises.length > 0 &&
            addExercises.map((ex) => {
              const selectedExercise = exercises.find(
                (exercise) => exercise.id == ex.exercise_id
              );
              const workoutRepetitions = {};
              repetitions.forEach((repetition) => {
                if (repetition.exercise_id === selectedExercise.id) {
                  if (!workoutRepetitions[repetition.exercise_id]) {
                    workoutRepetitions[repetition.exercise_id] = [];
                  }
                  workoutRepetitions[repetition.exercise_id].push(repetition);
                }
              });
              const idEx = (workoutRepetitions[selectedExercise.id] || []).map(
                (er) => er.exercise_id
              );
              return (
                <div className="workout-set-bar">
                  <h1 key={selectedExercise.id}>{selectedExercise.name}</h1>
                  {workoutRepetitions[selectedExercise.id] &&
                    workoutRepetitions[selectedExercise.id].map(
                      (repetition, index) => (
                        <div className="inputs-workout" key={index}>
                          <div className="index">{repetition.newIndex}</div>
                          <div>
                            <input
                              type="number"
                              min={0}
                              name="weight"
                              placeholder="Weight"
                              value={repetition.weight}
                              onChange={(e) =>
                                handleInputChange(
                                  selectedExercise.id,
                                  idEx[0],
                                  index,
                                  e
                                )
                              }
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              min={0}
                              name="repetitions"
                              placeholder="Reps"
                              value={repetition.repetitions}
                              onChange={(e) =>
                                handleInputChange(
                                  selectedExercise.id,
                                  idEx[0],
                                  index,
                                  e
                                )
                              }
                            />
                          </div>
                        </div>
                      )
                    )}
                  <div className="add-set-button">
                    <button
                      type="button"
                      onClick={() => {
                        // handleExerciseSelect(selectedExercise.id);
                        handleAddSet({ id: selectedExercise.id, i: i });
                      }}
                    >
                      Add Set
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        {showExerciseOptions && (
          <div className="exercise-options">
            <select
              name="exercise_id"
              onChange={(e) => {
                pickedExercise(e);
                handleExerciseSelect(e);
              }}
            >
              <option value="">Select an exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="add-exercise-button">
          <button type="button" onClick={handleAddExercise}>
            Add Exercise
          </button>
        </div>
        {name ? (
          <div className="create-workout-button">
            <button type="submit">Create</button>
          </div>
        ) : (
          <div className="cancel-workout-button">
            <button>Cancel</button>
          </div>
        )}
      </form>
    </div>
  );
}
