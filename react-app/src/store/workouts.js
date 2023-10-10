const GET_WORKOUTS = "workouts/GET_WORKOUTS";
const POST_WORKOUT = "workouts/POST_WORKOUT";
const DELETE_WORKOUT = "workouts/DELETE_WORKOUT";
const GET_WORKOUT = "workouts/GET_WORKOUT";

const getWorkouts = (workouts) => ({
  type: GET_WORKOUTS,
  workouts,
});

const postWorkout = (workout) => ({
  type: POST_WORKOUT,
  workout,
});

const deleteWorkout = (workoutId) => ({
  type: DELETE_WORKOUT,
  workoutId,
});

const getWorkout = (workout) => ({
  type: GET_WORKOUT,
  workout,
});

export const getWorkoutsThunk = () => async (dispatch) => {
  const res = await fetch("api/workouts");
  const data = await res.json();
  dispatch(getWorkouts(data));
  console.log(data);
  return data;
};

export const getWorkoutThunk = (exerciseId) => async (dispatch) => {
  const res = await fetch(`api/workouts/${exerciseId}`);
  const data = await res.json();
  dispatch(getWorkout(data));
  return data;
};

export const postWorkoutThunk = (workout) => async (dispatch) => {
  const res = await fetch("api/workouts/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(postWorkout(data));
    return data;
  } else {
    const errors = await res.json();
    throw errors;
  }
};

export const editWorkoutThunk = (workoutId, workout) => async (dispatch) => {
  const res = await fetch(`/api/workouts/${workoutId}`, {
    method: "PUT",
    body: workout,
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(postWorkout(data));
    return data;
  } else {
    const errors = await res.json();
    console.log("EDIT ERRORS", errors);
    throw errors;
  }
};

export const deleteWorkoutThunk = (workoutId) => async (dispatch) => {
  const res = await fetch(`/api/workouts/${workoutId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  dispatch(deleteWorkout(workoutId));
  return data;
};

const initialState = { allWorkouts: {}, singleWorkout: {} };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_WORKOUT:
      const { workout } = action.workout;
      return { ...state, singleWorkout: { ...workout } };

    case GET_WORKOUTS:
      let newObj = {};
      const { workouts } = action.workouts;
      workouts.map((workout) => (newObj[workout.id] = { ...workout }));
      return { ...state, allWorkouts: { ...newObj } };

    case POST_WORKOUT:
      const newWorkout = {};
      const allWork = Object.values(state.allWorkouts);
      allWork.map(
        (workout) =>
          (newWorkout[workout.id] = {
            ...workout,
          })
      );
      newWorkout[action.workout.id] = {
        ...action.workout,
      };
      return {
        allWork: newWorkout,
      };
    default:
      return state;
  }
}
