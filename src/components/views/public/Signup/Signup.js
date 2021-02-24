import Axios from "axios";
import React, { useState } from "react";
import classes from "./style.module.css";
import config from "../../../../config";
import { Link } from "react-router-dom";

export default function Signup() {
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email || !fullName || !password) return setError("Please fill all fields");
    const format = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(format)) return setError("Invalid email.");
    setIsFetching(true);
    Axios.post(`${config.apiDomain}/auth`, { email, fullName, password })
      .then((res) => res.data)
      .then(({ status, message }) => {
        setIsFetching(false);
        if (!status) return setError(message);
        setInfo(message);
      })
      .catch((e) => {
        setError("Server error");
        setIsFetching(false);
      });
  }

  return (
    <div className={classes["page"]}>
      <form onSubmit={onSubmit} className="form">
        <h2>Sign Up</h2>
        <hr />
        <span style={{ display: info ? "flex" : "none" }} className="info">
          <span>{info}</span>
          <i onClick={() => setInfo("")} className="fas fa-times"></i>
        </span>
        <span style={{ display: error ? "flex" : "none" }} className="error">
          <span>{error}</span>
          <i onClick={() => setError("")} className="fas fa-times"></i>
        </span>
        <p>Email</p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
        />
        <p>Name</p>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          type="text"
        />
        <p>Password</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button disabled={isFetching} type="submit">
          {isFetching ? <i className="fas fa-spinner spinner"></i> : "Sign Up"}
        </button>
        <Link className="link" to="/activateAccount">
          Activate your account.
        </Link>
      </form>
    </div>
  );
}
