import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import classes from "./style.module.css";
import JWT from "jsonwebtoken";
import config from "../../../../config";
import Axios from "axios";

export default function PrivateHeader() {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [renameIsOpen, setRenameIsOpen] = useState(false);
  const [accountMenuIsOpen, setAccountMenuIsOpen] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    setUser(JWT.decode(token));
    return () => {};
  }, [token]);

  useEffect(() => {
    setFullName(JWT.decode(JSON.parse(localStorage.getItem("token"))).fullName);
    return () => {};
  }, [user]);

  function logOut() {
    localStorage.removeItem("token");
    history.push("/");
  }
  function OpenRename(e) {
    e.stopPropagation();
    setRenameIsOpen(true);
    setAccountMenuIsOpen(false);
  }

  function closeRename(e) {
    if (e.target.id === "rename-bg") {
      setRenameIsOpen(false);
    }
  }

  function onSubmit(e) {
    setError("");
    setInfo("");
    e.preventDefault();
    setIsFetching(true);
    if (!fullName) {
      setIsFetching(false);
      setError("Please fill field.");
      return;
    }
    Axios.put(
      `${config.apiDomain}/rename`,
      { fullName },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.data)
      .then(({ status, message, token }) => {
        if (!status) {
          setIsFetching(false);
          return setError(message);
        }
        localStorage.setItem('token',JSON.stringify(token))
        setUser(prevState =>  ({...prevState,fullName }))
        setIsFetching(false);
        setInfo("Saved");
      })
      .catch((e) => {
        setError("Server error.")
        setIsFetching(false);
      });
  }
  return (
    <header className={classes["header"]}>
      <nav className={classes["navbar"]}>
        <Link className={classes["logo"]} to="/rooms">
          Video Chat
        </Link>

        <i
          onClick={() => setAccountMenuIsOpen(!accountMenuIsOpen)}
          className="fas fa-cog"
        >
          <div
            style={{ display: accountMenuIsOpen ? "block" : "none" }}
            className={classes["account-menu"]}
          >
            <p>{user.email}</p>
            <hr />
            <p className={classes["flex"]}>
              {user.fullName}
              <i onClick={OpenRename} className="fas fa-pen"></i>
            </p>
            <p className={classes["log-out"]} onClick={logOut}>
              Log Out
            </p>
          </div>
        </i>
      </nav>
      <div
        id="rename-bg"
        onClick={closeRename}
        style={{ display: renameIsOpen ? "flex" : "none" }}
        className={classes["rename-bg"]}
      >
        <form onSubmit={onSubmit} className="form">
          <h2>Rename</h2>
          <hr />
          <span style={{ display: info ? "flex" : "none" }} className="info">
            <span>{info}</span>
            <i onClick={() => setInfo("")} className="fas fa-times"></i>
          </span>
          <span style={{ display: error ? "flex" : "none" }} className="error">
            <span>{error}</span>
            <i onClick={() => setError("")} className="fas fa-times"></i>
          </span>

          <p>Full Name</p>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
          />

          <button type="submit">
            {isFetching ? <i className="fas fa-spinner spinner"></i> : "Rename"}
          </button>
        </form>
      </div>
    </header>
  );
}
