import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as exerciseActions from "../../store/exercises";
import { getWorkoutsThunk, postWorkoutThunk } from "../../store/workouts";
import { postExerciseRepetitions } from "../../store/reps";
import "./WorkoutModal.css";

export default function WorkoutForm() {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [i, setI] = useState(0);
  const [addExercises, setAddExercises] = useState([]);
  const [singleExercise, setSingleExercise] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const allExercises = useSelector((state) =>
    state.exercise.allExercises ? state.exercise.allExercises : {}
  );
  const [showExerciseOptions, setShowExerciseOptions] = useState(false);
  const exercises = Object.values(allExercises);
  const [isLoaded, setIsLoaded] = useState(false);

  const [repetitions, setRepetitions] = useState([]);
  const [iMap, setIMap] = useState({});
  const [wMap, setWMap] = useState({});
  const [selectedExercises, setSelectedExercises] = useState(null);
  useEffect(() => {
    if (selectedExercises) {
      setI(iMap[selectedExercises] || 0);
    }
  }, [selectedExercises, iMap]);

  useEffect(() => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (currentHour >= 4 && currentHour < 10) {
      setName("Morning Workout");
    } else if (currentHour >= 10 && currentHour < 13) {
      setName("Midday Workout");
    } else if (currentHour >= 13 && currentHour < 17) {
      setName("Afternoon Workout");
    } else {
      setName("Night Workout");
    }
  }, []);

  const handleAddSet = async ({ id, i }) => {
    await setIMap((prevMap) => ({
      ...prevMap,
      [id]: i + 1,
    }));

    setRepetitions([
      ...repetitions,
      { exercise_id: id, weight: "", repetitions: "", newIndex: i },
    ]);
  };
  const handleConfirm = (e) => {
    setConfirmSubmit(true);
  };
  const cancelConfirm = (e) => {
    setConfirmSubmit(false);
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercises(exercise.target.value);
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
    setWMap((prevMap) => ({
      ...prevMap,
      [selectedValue]: 1,
    }));
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

    try {
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
        history.push(`/workouts/${createdWorkout.id}`);
      }
    } catch (errRes) {
      if (Array.isArray(errRes.errors)) {
        let errorsObj = {};
        errRes.errors.forEach((err) => {
          const [key, val] = err.split(" : ");
          errorsObj[key] = val;
        });
        setErrors(errorsObj);
      }
    }
  };

  return (
    <div className="workout-form-full-page">
      <div className="workout-modal-full">
        <div>
          <h2>Create Workout</h2>
        </div>

        <form className="workout-modal-form" onSubmit={handleSubmit}>
          <div className="workout-name-page">
            <input
              className="workout-name-create"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
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
                const idEx = (
                  workoutRepetitions[selectedExercise.id] || []
                ).map((er) => er.exercise_id);
                return (
                  <div className="workout-set-bar">
                    <h1 key={selectedExercise.id}>{selectedExercise.name}</h1>
                    <div className="inputs-workout">
                      <div>
                        <p>sets</p>
                      </div>
                      <div>
                        <p className="weight-column">weight</p>
                      </div>
                      <div>
                        <p className="rep-column">reps</p>
                      </div>
                    </div>
                    {workoutRepetitions[selectedExercise.id] &&
                      workoutRepetitions[selectedExercise.id].map(
                        (repetition, index) => (
                          <div className="inputs-workout" key={index}>
                            <div className="index">
                              {repetition.newIndex + 1}
                            </div>
                            <div>
                              <input
                                type="number"
                                min={0.01}
                                step="any"
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
                                min={1}
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
                      {selectedExercises == selectedExercise.id ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await handleAddSet({
                              id: selectedExercise.id,
                              i: i,
                            });
                          }}
                        >
                          Add Set
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            setSelectedExercises(selectedExercise.id);
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          {showExerciseOptions ? (
            <div className="exercise-options">
              <select
                name="exercise_id"
                onChange={(e) => {
                  pickedExercise(e);
                  handleExerciseSelect(e);
                }}
              >
                <option value="">Select an exercise</option>
                {exercises
                  // .filter((exercise) => !wMap[exercise.id])
                  .map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.category === "barbell" ||
                      exercise.category === "dumbbell"
                        ? `${exercise.name} (${exercise.category})`
                        : exercise.name}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div>
              {(!wMap || exercises.some((exercise) => !wMap[exercise.id])) && (
                <div className="add-exercise-button">
                  <button type="button" onClick={handleAddExercise}>
                    Add Exercise
                  </button>
                </div>
              )}
            </div>
          )}

          {repetitions.some(
            (rep) => rep.exercise_id && rep.weight && rep.repetitions
          ) ? (
            <div className="create-workout-button">
              {confirmSubmit && (
                <div className="workout-create-container">
                  <p className="error-text">
                    Any empty or incomplete sets will be removed confirm?
                  </p>
                  <div className="confirm-cancel-workout">
                    <button
                      className="cancel-create"
                      type="button"
                      onClick={cancelConfirm}
                    >
                      Cancel
                    </button>
                    <button className="confirm-create" type="submit">
                      Confirm
                    </button>
                  </div>
                </div>
              )}
              {!confirmSubmit && (
                <button
                  className="create-workout-button-a"
                  cratype="button"
                  onClick={handleConfirm}
                >
                  Create
                </button>
              )}
            </div>
          ) : (
            <div className="cancel-workout-button">
              <button onClick={() => history.push("/")}>Cancel</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
