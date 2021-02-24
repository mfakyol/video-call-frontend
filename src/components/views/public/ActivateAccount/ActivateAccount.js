import Axios from "axios";
import React, { useState } from "react";
import classes from "./style.module.css";
import config from "../../../../config";

export default function ActivateAccount() {
  const [email, setEmail] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setIsFetching(true);
    setError("");
    setInfo("");
    if (!email || !activationCode) {
      setIsFetching(false);
      return setError("Please fill all fields.");
    }
    Axios.put(`${config.apiDomain}/auth`, { email, activationCode })
      .then((res) => res.data)
      .then(({ status, message }) => {
        setIsFetching(false);
        if (!status) return setError(message);
        return setInfo(message);
      })
      .catch((e) => {
        setIsFetching(false);
        return setError("Server error.");
      });
  }

  return (
    <div className={classes["page"]}>
      <form onSubmit={onSubmit} className="form">
        <h2>Activate Account</h2>
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

        <p>Activation Code</p>
        <input
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          type="text"
        />
        <button disabled={isFetching} type="submit">
          {isFetching ? (
            <i className="fas fa-spinner spinner"></i>
          ) : (
            "Activate Account"
          )}
        </button>
      </form>
    </div>
  );
}
