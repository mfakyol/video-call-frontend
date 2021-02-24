import Axios from "axios";
import React, { useState } from "react";
import classes from "./style.module.css";
import config from '../../../../config'

export default function Login({history}) {
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setIsFetching(true)
    if (!email || !password){
        setIsFetching(false)
        return setError("Please fill all fields.");
    } 
    Axios.get(`${config.apiDomain}/auth`,{params:{email, password}})
    .then(res => res.data)
    .then(({status,message, token}) => {
        setIsFetching(false)
        if(!status) return setError(message)
        localStorage.setItem("token",JSON.stringify(token))
        history.push("/rooms")
    })
    .catch(e => {
        setIsFetching(false)
        return setError("Server error.")
    })
}

  return (
    <div className={classes["page"]}>
      <form onSubmit={onSubmit} className="form">
        <h2>Log In</h2>
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
        <p>Password</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button disabled={isFetching} type="submit">
          {isFetching ? <i className="fas fa-spinner spinner"></i> : "Log In"}
        </button>
      </form>
    </div>
  );
}
