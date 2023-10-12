import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as exerciseActions from "../../store/exercises";
import { useModal } from "../../context/Modal";
import { getWorkoutsThunk, postWorkoutThunk } from "../../store/workouts";
import { postExerciseRepetitions } from "../../store/reps";

export default function ExerciseForm() {
  const [repetitions, setRepetitions] = useState([]);
  const handleAddRepetition = () => {
    setRepetitions([
      ...repetitions,
      { exercise_id: "", weight: "", repetitions: "" },
    ]);
  };
  return <></>;
}
