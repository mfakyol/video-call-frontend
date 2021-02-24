import React, { useEffect, useRef } from "react";
import classes from "./style.module.css";

export default function Video({ peer, socketRef }) {
  const refVideo = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      refVideo.current.srcObject = stream;
      console.log(peer);
    });
  }, [peer]);

  return (
    <div className={classes["video-container"]}>
      <video
        playsInline
        autoPlay
        ref={refVideo}
        style={{ visibility: peer.isCameraOpen ? "visible" : "hidden" }}
        className={classes["video"]}
      ></video>
      <div className={classes["video-info"]}>
        <i className="fas fa-video-slash"></i>
      </div>
      <div className={classes["video-bar"]}>
        <i
          style={{ display: peer.isMicrophoneOpen ? "none" : "inline" }}
          className="fas fa-microphone-slash"
        ></i>
        <span>{peer.userName}</span>
      </div>
    </div>
  );
}
