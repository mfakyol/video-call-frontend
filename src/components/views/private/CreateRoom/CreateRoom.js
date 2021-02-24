import Axios from "axios";
import React, { useState } from "react";
import classes from "./style.module.css";
import config from "../../../../config";

export default function CreateRoom({ history }) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [roomSize, setRoomSize] = useState(2);
  const [isJoinable, setIsJoinable] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  function onSubmit(e) {
    setError("");
    setIsFetching(true);
    e.preventDefault();
    if (!name || !password || !roomSize) {
      setIsFetching(false);
      return setError("Please fill all fields");
    }
    Axios.post(
      `${config.apiDomain}/room`,
      {
        name,
        password,
        roomSize,
        isJoinable,
        isOnline,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.data)
      .then(({ status, room, message }) => {
        if (!status) {
            setIsFetching(false);
            return setError(message);
        }
        history.push(`/rooms/${room.id}`);
      })
      .catch((e) => {
        setIsFetching(false);
        setError("Server error.");
      });
  }
  return (
    <div className={classes["page"]}>
      <form onSubmit={onSubmit} className="form">
        <h2>Create Room</h2>
        <hr />
        <span style={{ display: error ? "flex" : "none" }} className="error">
          <span>{error}</span>
          <i onClick={() => setError("")} className="fas fa-times"></i>
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
          type="password"
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
          Allow to Join (You can change after create room)
        </label>
        <label>
          <input
            checked={isOnline}
            onChange={() => setIsOnline(!isOnline)}
            type="checkbox"
          />
          Online Room (You can change after create room)
        </label>

        <button disabled={isFetching} type="submit">
          {isFetching ? (
            <i className="fas fa-spinner spinner"></i>
          ) : (
            "Create Room"
          )}
        </button>
      </form>
    </div>
  );
}
