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
