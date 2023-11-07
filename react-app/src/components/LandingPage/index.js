import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import mascot from "../../assets/images/mascot.png";
import "./LandingPage.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
export default function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="landing-page">
      <div className="top-landing">
        <div className="left-landing">
          <div className="landing-name">
            <h1>Xercise</h1>
          </div>
          <div>
            <h3>
              Welcome to Xercise, your fitness partner for a healthier you!
              Let's break a sweat, reach for your dreams, and make every step
              count on this incredible fitness adventure. Get ready to unleash
              your potential and transform your life – one Xercise at a time!
            </h3>
          </div>
        </div>
        <div className="right-landing">
          <img className="mascot" src={mascot}></img>
        </div>
      </div>
      <div className="about-me">
        <a href="https://github.com/XavierAG">
          <i className="fa-brands fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/xavier-guzman/">
          <i className="fa-brands fa-linkedin"></i>
        </a>
      </div>
    </div>
  );
}
