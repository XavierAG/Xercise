import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ExercisesPage.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import * as exerciseActions from "../../store/exercises";
import OpenModalButton from "../OpenModalButton";
import ExerciseModal from "../ExerciseModal";
import EditExerciseModal from "../EditExerciseModal";

export default function ExercisesPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const allExercises = useSelector((state) =>
    state.exercise.allExercises ? state.exercise.allExercises : {}
  );
  const exercises = Object.values(allExercises);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(exerciseActions.getExercisesThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="exercises-container">
      <h1>HEllO</h1>
      <div className="create-exercise-cont">
        <OpenModalButton
          className="create-exercise"
          buttonText="CREATE EXERCISE"
          modalComponent={<ExerciseModal />}
        />
      </div>
      {exercises.length &&
        exercises.map((exercise) => (
          <div className="exercise-container" key={exercise.id}>
            <img src={exercise.image_url}></img>
            <div>
              <p>{exercise.body_part}</p>
              <p>{exercise.category}</p>
            </div>
            <h2>{exercise.name}</h2>
            <div className="buttons">
              {exercise.owner_id == sessionUser.id && (
                <OpenModalButton
                  className="edit-exercise"
                  buttonText="EDIT EXERCISE"
                  modalComponent={
                    <EditExerciseModal exerciseId={exercise.id} />
                  }
                />
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
