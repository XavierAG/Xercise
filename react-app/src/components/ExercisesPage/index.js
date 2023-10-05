import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../store/session";
import "./ExercisesPage.css";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import * as exerciseActions from "../../store/exercises";

export default function ExercisesPage() {
  const dispatch = useDispatch();
  const allExercises = useSelector((state) =>
    state.exercise.allExercises ? state.exercise.allExercises : {}
  );
  const exercises = Object.values(allExercises);
  console.log("EXERCISE", exercises);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(exerciseActions.getExercisesThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="exercises-container">
      <h1>HEllO</h1>
      {exercises.length &&
        exercises.map((exercise) => (
          <div className="exercise-container" key={exercise.id}>
            <div>{console.log("SINGLEEX", exercise)}</div>
            <img src={exercise.image_url}></img>
            <div>
              <p>{exercise.body_part}</p>
              <p>{exercise.category}</p>
            </div>
            <h2>{exercise.name}</h2>
          </div>
        ))}
    </div>
  );
}
