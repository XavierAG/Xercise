const POST_REPS = "workouts/POST_REPS";

const postReps = (reps) => ({
  type: POST_REPS,
  reps,
});

export const postExerciseRepetitions = (rep) => async (dispatch) => {
  const response = await fetch("/api/reps/exercise-repetitions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rep),
  });
};

export const editRepThunk = (repId, rep) => async (dispatch) => {
  const res = await fetch(`/api/reps/${repId}`, {
    method: "PUT",
    body: rep,
  });
  // if (res.ok) {
  //   const data = await res.json();
  //   dispatch(postReps(data));
  //   return data;
  // } else {
  //   const errors = await res.json();
  //   console.log("EDIT ERRORS", errors);
  //   throw errors;
  // }
};
