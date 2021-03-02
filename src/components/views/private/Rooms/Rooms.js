import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../../../config";
import classes from "./style.module.css";

export default function Rooms() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    Axios.get(`${config.apiDomain}/room/getrooms`, { params: { token } })
      .then((res) => res.data)
      .then(({ status, rooms, message }) => {
        if (!status) return console.log(message);
        setRooms(rooms);
        setIsLoading(false);
      })
      .catch((e) => console.log(e));
    return () => {};
  }, [token]);

  const Rooms = () => {
    return (
      <>
        <div className={classes["create-wrapper"]}>        <Link className={classes["create-button"]} to="/rooms/create">
          Create New Room
        </Link></div>
       { rooms.map((room) => (
        <div key={room.id} className={classes["card"]}>
          <Link to={`/rooms/${room.id}`}>
            <h3 className={classes["card-header"]}>{room.name}</h3>
          </Link>
          <hr />
          <div className={classes["card-body"]}>
            <p>
              <b>Password: </b> {room.password}
            </p>
            <p>
              <b>Joinable: </b> {room.isJoinable ? "Joinable" : "Not Joinable"}
            </p>
            <p>
              <b>Online: </b> {room.isOnline ? "Online" : "Offline"}
            </p>
            <p>
              <b>Room Size: </b> {room.roomSize}
            </p>
            <p>
              <b>Created Date:</b> {new Date(room.createdDate).toLocaleString()}
            </p>
            <p>
              <b>Join Link: </b>
              <span></span>
              {`http://localhost:3000/room/${room.id}/${room.password}`}
            </p>
          </div>
        </div>
        ))}
      </>
    );
  };

  return (
    <div className={classes["page"]}>{isLoading ? "Loading..." : Rooms()}</div>
  );
}
