import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as exerciseActions from "../../store/exercises";
import OpenModalButton from "../OpenModalButton";
import ExerciseModal from "../ExerciseModal";
import EditExerciseModal from "../EditExerciseModal";
import "./ExerciseDetailPage.css";

export default function ExerciseDetailPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const allExercises = useSelector((state) =>
    state.exercise.allExercises ? state.exercise.allExercises : {}
  );
  const singleExercise = useSelector((state) =>
    state.exercise.singleExercise ? state.exercise.singleExercise : {}
  );
  const { exerciseId } = useParams();
  const exercises = Object.values(allExercises);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(exerciseActions.getExcerciseThunk(exerciseId));
    dispatch(exerciseActions.getExercisesThunk()).then(() => setIsLoaded(true));
  }, [dispatch, exerciseId]);

  return (
    <>
      <div className="single-exercise">
        <div className="exercise-detail-left">
          <img
            className="exercise-img-single"
            src={singleExercise.image_url}
          ></img>
        </div>
        <div className="exercise-detail-right">
          <div className="single-top-right">
            <h1>{singleExercise.name}</h1>
            <div className="buttons">
              {sessionUser && singleExercise.owner_id == sessionUser.id && (
                <OpenModalButton
                  className="edit-exercise"
                  buttonText="EDIT EXERCISE"
                  modalComponent={
                    <EditExerciseModal exerciseId={singleExercise.id} />
                  }
                />
              )}
            </div>
          </div>
          <div className="single-description">
            <p>{singleExercise.description}</p>
          </div>
          <div className="body-category-single">
            <p>{singleExercise.body_part}</p>
          </div>
          <div className="body-category-single">
            <p>{singleExercise.category}</p>
          </div>
        </div>
      </div>
      <div className="single-exercises-container">
        <h1 className="other-exercises">OTHER EXERCISES</h1>
        {exercises.length &&
          exercises
            .filter((exercise) => exercise.id !== singleExercise.id)
            .map((exercise) => (
              <div className="exercise-container" key={exercise.id}>
                <img src={exercise.image_url}></img>
                <div>
                  <p>{exercise.body_part}</p>
                  <p>{exercise.category}</p>
                </div>
                <h2>{exercise.name}</h2>
              </div>
            ))}
      </div>
    </>
  );
}
