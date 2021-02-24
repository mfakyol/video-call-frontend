import Axios from "axios";
import React, { useEffect, useState } from "react";
import classes from "./style.module.css";
import config from "../../../../config";

export default function RoomDetail(props) {
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [roomSize, setRoomSize] = useState(2);
  const [isJoinable, setIsJoinable] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    setIsLoading(true);
    Axios.get(`${config.apiDomain}/room`, {
      params: { token, id: props.match.params.roomId },
    })
      .then((res) => res.data)
      .then(({ status, room, message }) => {
        if (!status) return props.history.push("/rooms");
        setName(room.name);
        setPassword(room.password);
        setRoomSize(room.roomSize);
        setIsJoinable(room.isJoinable);
        setIsOnline(room.isOnline);
        setIsLoading(false);
      })
      .catch((e) => {
        props.history.push("/rooms");
      });
  }, [token, props.match.params.roomId, props.history]);

  function onSubmit(e) {
    setError("");
    setInfo("");
    setIsFetching(true);
    e.preventDefault();
    if (!name || !password || !roomSize) {
      setIsFetching(false);
      return setError("Please fill all fields");
    }
    Axios.put(
      `${config.apiDomain}/room`,
      {
        name,
        password,
        roomSize,
        isJoinable,
        isOnline,
        id: props.match.params.roomId,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.data)
      .then(({ status, message }) => {
        if (!status) {
          setIsFetching(false);
          return setError(message);
        }
        setInfo(message);
        setIsFetching(false);
      })
      .catch((e) => {
        setIsFetching(false);
        setError("Server error.");
      });
  }

  function form() {
    return (
      <form onSubmit={onSubmit} className="form">
        <h2>Room Settings</h2>
        <hr />
        <span style={{ display: error ? "flex" : "none" }} className="error">
          <span>{error}</span>
          <i onClick={() => setError("")} className="fas fa-times"></i>
        </span>
        <span style={{ display: info ? "flex" : "none" }} className="info">
          <span>{info}</span>
          <i onClick={() => setInfo("")} className="fas fa-times"></i>
        </span>
        <p>Room Name</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
        <p>Room Password</p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        />

        <p>Room Size (max size: 10)</p>
        <input
          value={roomSize}
          onChange={(e) =>
            setRoomSize(e.target.value > 10 ? 10 : e.target.value)
          }
          type="number"
          min={2}
          max={10}
        />
        <label>
          <input
            checked={isJoinable}
            onChange={() => setIsJoinable(!isJoinable)}
            type="checkbox"
          />
          Allow to Join
        </label>
        <label>
          <input
            checked={isOnline}
            onChange={() => setIsOnline(!isOnline)}
            type="checkbox"
          />
          Online Room
        </label>

        <button disabled={isFetching} type="submit">
          {isFetching ? (
            <i className="fas fa-spinner spinner"></i>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    );
  }

  return (
    <div className={classes["page"]}>{isLoading ? "Loading" : form()}</div>
  );
}
