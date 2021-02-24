import React, { useEffect, useRef } from "react";
import classes from "./style.module.css";

export default function MyVideo({
  srcObject,
  isCameraOpen,
  isMicrophoneOpen,
  name,
  ...props
}) {
  const refVideo = useRef();
  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
    return () => {};
  }, [srcObject]);

  useEffect(() => {
    if (!srcObject) return;
    srcObject.getAudioTracks()[0].enabled = isMicrophoneOpen;
    srcObject.getVideoTracks()[0].enabled = isCameraOpen;
  }, [isCameraOpen, isMicrophoneOpen, srcObject]);

  return (
    <div className={classes["video-container"]}>
      <video
        muted
        playsInline
        autoPlay
        ref={refVideo}
        style={{ visibility: isCameraOpen ? "visible" : "hidden" }}
        className={classes["video"]}
      ></video>
      <div className={classes["video-info"]}>
        <i className="fas fa-video-slash"></i>
      </div>
      <div className={classes["video-bar"]}>
        <i
          style={{ display: isMicrophoneOpen ? "none" : "inline" }}
          className="fas fa-microphone-slash"
        ></i>
        <span>You ({name})</span>
      </div>
    </div>
  );
}
