import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ExercisesPage.css";
import { NavLink, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as exerciseActions from "../../store/exercises";
import OpenModalButton from "../OpenModalButton";
import ExerciseModal from "../ExerciseModal";
import mascot from "../../assets/images/mascot.png";
import EditExerciseModal from "../EditExerciseModal";

export default function ExercisesPage() {
  const dispatch = useDispatch();
  const history = useHistory();
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
      <div className="create-exercise-cont">
        {sessionUser && (
          <OpenModalButton
            className="create-exercise"
            buttonText="CREATE NEW EXERCISE"
            modalComponent={<ExerciseModal />}
          />
        )}
      </div>
      <div className="exercise-container">
        {exercises.length > 0 &&
          exercises.map((exercise) => (
            <NavLink
              className="map-exercise"
              exact
              to={`/exercises/${exercise.id}`}
            >
              <h1 className="exercise-name">{exercise.name}</h1>
              {exercise.image_url ? (
                <img className="exercise-img" src={exercise.image_url}></img>
              ) : (
                <img className="exercise-img" src={mascot}></img>
              )}

              <div className="part-category">
                <div>
                  <p>{exercise.body_part}</p>
                </div>
                <div>
                  <p>{exercise.category}</p>
                </div>
              </div>
            </NavLink>
          ))}
      </div>
    </div>
  );
}
