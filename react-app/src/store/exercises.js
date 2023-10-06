const GET_EXERCISES = "exercises/GET_EXERCISES";
const POST_EXERCISES = "exercises/POST_EXERCISES";
const DELETE_EXERCISE = "exercises/DELETE_EXERCISE";
const GET_EXERCISE = "exercises/GET_EXERCISE";

const getExercises = (exercises) => ({
  type: GET_EXERCISES,
  exercises,
});

const postExercises = (exercise) => ({
  type: POST_EXERCISES,
  exercise,
});

const deleteExercise = (exerciseId) => ({
  type: DELETE_EXERCISE,
  exerciseId,
});

const getExercise = (exerciseId) => ({
  type: GET_EXERCISE,
  exerciseId,
});

export const getExercisesThunk = () => async (dispatch) => {
  const res = await fetch("api/exercises");
  const data = await res.json();
  console.log("DATA", data);
  dispatch(getExercises(data));
  return data;
};

export const postExerciseThunk = (exercise, newImage) => async (dispatch) => {
  let res;
  if (newImage) {
    res = await fetch("/api/exercises/", {
      method: "POST",
      body: exercise,
    });
  } else {
    res = await fetch("/api/exercises/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exercise),
    });
  }
  if (res.ok) {
    const data = await res.json();
    dispatch(postExercises(data));
    return data;
  } else {
    const errors = await res.json();
    throw errors;
  }
};
const initialState = { allExercises: {} };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_EXERCISES:
      let newObj = {};
      const { exercises } = action.exercises;
      exercises.map(
        (exercise) =>
          (newObj[exercise.id] = {
            ...exercise,
          })
      );
      return { ...state, allExercises: { ...newObj } };
    case POST_EXERCISES:
      const newExercise = {};
      console.log("HELLO", state.allExercises);
      const allEx = Object.values(state.allExercises);
      console.log("BYE", allEx);
      allEx.map(
        (exercise) =>
          (newExercise[exercise.id] = {
            ...exercise,
          })
      );
      newExercise[action.exercise.id] = {
        ...action.exercise,
      };
      return {
        allEx: newExercise,
      };
    default:
      return state;
  }
}
