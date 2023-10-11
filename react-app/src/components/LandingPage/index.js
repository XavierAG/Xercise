import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li>
        <NavLink exact to="/">
          Home
        </NavLink>
        <NavLink exact to="/exercises">
          Exercises
        </NavLink>
        <NavLink exact to="/workouts">
          Workouts
        </NavLink>
      </li>
    </ul>
  );
}
