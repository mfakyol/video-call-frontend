import React, { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./style.module.css";


export default function FrontRoom({name,setName,video,setVideo, audio, setAudio, setIsJoinedRoom}) {

  const [error, setError] = useState("");

  function onSubmit(e){
      setError("")
    e.preventDefault()
    if(name==="") return setError("Please fill name field.")
    setIsJoinedRoom(true)
  }


  return (
    <>
      <header className={classes["header"]}>
        <nav className={classes["navbar"]}>
          <Link className={classes["logo"]} to="/">
            Video Chat
          </Link>
        </nav>
      </header>

      <div className={classes["page"]}>
        <form onSubmit={onSubmit} className="form">
          <h2>Join Room</h2>
          <hr />
          <span style={{ display: error ? "flex" : "none" }} className="error">
            <span>{error}</span>
            <i onClick={() => setError("")} className="fas fa-times"></i>
          </span>
          <p>Name</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
          />
          <label>
            <input onChange={() => setVideo(!video)} type="checkbox" /> Video
          </label>
          <label>
            <input onChange={() => setAudio(!audio)} type="checkbox" /> Microphone
          </label>

          <button type="submit">Join</button>
        </form>
      </div>
    </>
  );
}
