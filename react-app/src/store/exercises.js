const GET_EXERCISES = "exercises/GET_EXERCISES";
const POST_EXERCISES = "exercises/POST_EXERCISES";
const DELETE_EXERCISE = "exercises/DELETE_EXERCISE";
const GET_EXERCISE = "exercises/GET_EXERCISE";

const getExercises = (exercises) => ({
  type: GET_EXERCISES,
  exercises,
});

const postExercises = (exercises) => ({
  type: POST_EXERCISES,
  exercises,
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
    default:
      return state;
  }
}
