import React, { useEffect, useState } from "react";
import FrontRoom from '../FrontRoom/FrontRoom'
import Room from '../Room/Room'
import Jwt from "jsonwebtoken";
export default function RoomPage() {
    const token = JSON.parse(localStorage.getItem("token"));
    const [name, setName] = useState("");
    const [video, setVideo] = useState(false)
    const [audio, setAudio] = useState(false)
    const [isJoinedRoom, setIsJoinedRoom] = useState(false)
    
    useEffect(() => {
        if (token) {
          setName(Jwt.decode(token).fullName);
        }
        return () => {};
      }, [token]);

    return isJoinedRoom ? <Room video={video} audio={audio} defaultName={name} /> :  <FrontRoom name={name} setName={setName} video={video} audio={audio} setVideo={setVideo} setAudio={setAudio} setIsJoinedRoom={setIsJoinedRoom}/> 
}
