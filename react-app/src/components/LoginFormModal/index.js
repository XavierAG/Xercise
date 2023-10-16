import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  let errorsObj = {};
  if (errors.length) {
    errors.forEach((err) => {
      const [key, val] = err.split(" : ");
      errorsObj[key] = val;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
    }
  };
  const demoUser = async () => {
    const email = "xercisedemo@gmail.com";
    const password = "xercisepassword";
    dispatch(login(email, password));
    closeModal();
  };

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="login-modal-form">
          <div className="full-input">
            <div className="login-form-inputs">
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="error-container">
              {errorsObj.email && (
                <p className="error-text">{errorsObj.email}</p>
              )}
            </div>
          </div>
          <div className="full-input">
            <div className="login-form-inputs">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="error-container">
              {errorsObj.password && (
                <p className="error-text">{errorsObj.password}</p>
              )}
            </div>
          </div>
          <button className="submit-button-modal" type="submit">
            Log In
          </button>
        </div>
      </form>
      <button className="demo-modal-button" onClick={demoUser}>
        Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;
