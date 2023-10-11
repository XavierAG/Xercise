import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import ExercisesPage from "./components/ExercisesPage";
import WorkoutPage from "./components/WorkoutPage";
import LandingPage from "./components/LandingPage";
import ExerciseDetailPage from "./components/ExerciseDetailPage";
import WorkoutDetailPage from "./components/WorkoutDetailPage";
import Navigation from "./components/Navigation";
import EditWorkoutForm from "./components/EditWorkoutForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route path="/login">
          <LoginFormPage />
        </Route>
        <Route path="/signup">
          <SignupFormPage />
        </Route>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/exercises">
          <ExercisesPage />
        </Route>
        <Route exact path="/exercises/:exerciseId">
          <ExerciseDetailPage />
        </Route>
        <Route exact path="/workouts">
          <WorkoutPage />
        </Route>
        <Route exact path="/workouts/:workoutId">
          <WorkoutDetailPage />
        </Route>
        <Route exact path="/workouts/:workoutId/edit">
          <EditWorkoutForm />
        </Route>
      </Switch>
    </>
  );
}

export default App;
