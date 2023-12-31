import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteExerciseThunk, getExcerciseThunk } from "../../store/exercises";
import * as exerciseActions from "../../store/exercises";
import OpenModalButton from "../OpenModalButton";
import EditExerciseModal from "../EditExerciseModal";
import "./DeleteExerciseModal.css";

export default function DeleteExerciseModal({ exerciseId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState("");
  const singleExercise = useSelector((state) => state.exercise.singleExercise);
  const allExercises = useSelector((state) =>
    state.exercise.allExercises ? state.exercise.allExercises : {}
  );

  useEffect(() => {
    dispatch(getExcerciseThunk(exerciseId));
  }, [dispatch, exerciseId]);

  useEffect(() => {
    if (singleExercise) {
      setName(singleExercise.name || "");
    }
  }, [singleExercise]);

  const handleDelete = () => {
    dispatch(deleteExerciseThunk(exerciseId));
    closeModal();
    dispatch(exerciseActions.getExercisesThunk());
    history.push("/exercises");
  };

  return (
    <div className="delete-exercise-modal">
      <h1>Delete {name}?</h1>
      <div>
        <OpenModalButton
          className="cancel-delete-exercise"
          buttonText="Cancel"
          modalComponent={<EditExerciseModal exerciseId={exerciseId} />}
        />
        <button className="confirm-delete-exercise" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
