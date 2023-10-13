import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import logo from "../../assets/images/x-low-resolution-logo-color-on-transparent-background.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav-bar">
      <li className="left-bar">
        <NavLink exact to="/" className="landing-nav-home">
          <img alt="logo" className="landing-nav-logo" src={logo} />
        </NavLink>
        <NavLink className="nav-nav" exact to="/exercises">
          <div className="button-wrapper">
            <div className="button-top">Exercises</div>
            <div className="button-outline"></div>
          </div>
        </NavLink>
        {sessionUser && (
          <NavLink className="nav-nav" exact to="/workouts">
            <div className="button-wrapper">
              <div className="button-top">Workouts</div>
              <div className="button-outline"></div>
            </div>
          </NavLink>
        )}
      </li>
      {isLoaded && (
        <li className="right-bar">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
