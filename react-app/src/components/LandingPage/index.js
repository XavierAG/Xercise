import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LandingPage() {
  const sessionUser = useSelector((state) => state.session.user);

  return <ul></ul>;
}
