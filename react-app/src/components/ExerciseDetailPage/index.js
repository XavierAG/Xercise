import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as exerciseActions from "../../store/exercises";
import OpenModalButton from "../OpenModalButton";
import ExerciseModal from "../ExerciseModal";
import EditExerciseModal from "../EditExerciseModal";
import mascot from "../../assets/images/mascot.png";
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
    dispatch(exerciseActions.getExercisesThunk()).then(() => setIsLoaded(true));
    dispatch(exerciseActions.getExcerciseThunk(exerciseId));
  }, [dispatch, exerciseId]);

  function scrollToTop() {
    window.scrollTo(0, 0);
  }
  return (
    <div className="single-full-page">
      <div className="single-exercise">
        <div className="exercise-detail-left">
          {singleExercise.image_url ? (
            <img
              className="exercise-img-single"
              src={singleExercise.image_url}
            ></img>
          ) : (
            <img className="exercise-img-single" src={mascot}></img>
          )}
        </div>
        <div className="exercise-detail-right">
          <div className="single-top-right">
            {singleExercise.category == "barbell" ||
            singleExercise.category === "dumbbell" ? (
              <h1 className="exercise-name-single">
                {singleExercise.name} ({singleExercise.category})
              </h1>
            ) : (
              <h1 className="exercise-name-single">{singleExercise.name}</h1>
            )}
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
      <div className="other-exercises-h1">
        <h1 className="other-exercises">OTHER EXERCISES</h1>
      </div>
      <div className="exercise-container">
        {exercises.length > 0 &&
          exercises
            .filter((exercise) => exercise.id !== singleExercise.id)
            .map((exercise) => (
              <NavLink
                className="map-exercise"
                exact
                to={`/exercises/${exercise.id}`}
                onClick={() => scrollToTop()}
              >
                {exercise.category == "barbell" ||
                exercise.category === "dumbbell" ? (
                  <h1 className="exercise-name">
                    {exercise.name} ({exercise.category})
                  </h1>
                ) : (
                  <h1 className="exercise-name">{exercise.name}</h1>
                )}
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
