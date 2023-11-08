import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const [pasErr, setPasErr] = useState([]);
  let errorsObj = {};
  if (errors.length) {
    errors.forEach((err) => {
      const [key, val] = err.split(" : ");
      errorsObj[key] = val;
    });
  }
  console.log(errorsObj);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
        setPasErr([]);
      } else {
        closeModal();
      }
    } else {
      setPasErr([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  return (
    <div className="signup-modal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="signup-modal-form">
          <div className="signup-form-inputs">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="error-container">
            {errorsObj.email && <p className="error-text">{errorsObj.email}</p>}
          </div>
          <div className="signup-form-inputs">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="error-container">
            {errorsObj.username && (
              <p className="error-text">{errorsObj.username}</p>
            )}
          </div>
          <div className="signup-form-inputs">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="signup-form-inputs">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="error-container">
            {pasErr && <p className="error-text">{pasErr}</p>}
          </div>
          <button className="submit-button-modal" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
