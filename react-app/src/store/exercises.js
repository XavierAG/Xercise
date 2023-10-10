const GET_EXERCISES = "exercises/GET_EXERCISES";
const POST_EXERCISE = "exercises/POST_EXERCISE";
const DELETE_EXERCISE = "exercises/DELETE_EXERCISE";
const GET_EXERCISE = "exercises/GET_EXERCISE";

const getExercises = (exercises) => ({
  type: GET_EXERCISES,
  exercises,
});

const postExercise = (exercise) => ({
  type: POST_EXERCISE,
  exercise,
});

const deleteExercise = (exerciseId) => ({
  type: DELETE_EXERCISE,
  exerciseId,
});

const getExercise = (exercise) => ({
  type: GET_EXERCISE,
  exercise,
});

export const getExercisesThunk = () => async (dispatch) => {
  const res = await fetch("api/exercises");
  const data = await res.json();
  dispatch(getExercises(data));
  return data;
};

export const getExcerciseThunk = (exerciseId) => async (dispatch) => {
  const res = await fetch(`api/exercises/${exerciseId}`);
  const data = await res.json();
  dispatch(getExercise(data));
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
    dispatch(postExercise(data));
    return data;
  } else {
    const errors = await res.json();
    throw errors;
  }
};

export const editExerciseThunk =
  (exerciseId, exercise, newImage) => async (dispatch) => {
    let res;
    if (newImage) {
      res = await fetch(`/api/exercises/${exerciseId}`, {
        method: "PUT",
        body: exercise,
      });
    } else {
      res = await fetch(`/api/exercises/${exerciseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });
    }
    if (res.ok) {
      const data = await res.json();
      dispatch(postExercise(data));
      return data;
    } else {
      const errors = await res.json();
      console.log("EDIT ERRORS", errors);
      throw errors;
    }
  };

export const deleteExerciseThunk = (exerciseId) => async (dispatch) => {
  const res = await fetch(`/api/exercises/${exerciseId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  dispatch(deleteExercise(exerciseId));
  return data;
};

const initialState = { allExercises: {}, singleExercise: {} };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_EXERCISE:
      // let singleObj = action.exercise ;
      const { exercise } = action.exercise;
      return { ...state, singleExercise: { ...exercise } };

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
    case POST_EXERCISE:
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

    case DELETE_EXERCISE:
      const deleteState = {};
      const delAllArr = Object.values(state.allExercises);
      delAllArr.map((exercise) => (deleteState[exercise.id] = { ...exercise }));
      delete deleteState[action.exerciseId];
      return deleteState;

    default:
      return state;
  }
}
