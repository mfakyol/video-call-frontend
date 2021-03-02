import React, { useState, useRef, useEffect } from "react";
import classes from "./style.module.css";
import Sidebar from "../Sidebar/Sidebar";
import MyVideo from "../MyVideo/MyVideo";
import Header from "../Header/Header";
import Video from "../Video/Video";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";

export default function Room({ defaultName, video, audio }) {
  const params = useParams();
  const [chats, setChats] = useState([]);
  const [peers, setPeers] = useState([]);
  const [srcObject, setSrcObject] = useState(undefined);
  const [isCameraOpen, setIsCameraOpen] = useState(video);
  const [isMicrophoneOpen, setIsMicrophoneOpen] = useState(audio);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState(defaultName || "user");
  const socketRef = useRef();
  const peersRef = useRef([]);
  const roomId = params.roomId;
  const password = params.password;



  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3001", {
      query: { id: uuid(), name },
    });
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setSrcObject(stream);
        socketRef.current.emit("join_room", {
          roomId,
          isMicrophoneOpen,
          isCameraOpen,
          password,
        });

        socketRef.current.on("no_room", () => {
          console.log("no room");
          //redirect no room page
          window.location.href = "/accessdenied/Room not exist";
        });

        socketRef.current.on("room_closed", () => {
          console.log("room closed");
          //redirect no room page
          window.location.href = "/accessdenied/Room closed";
        });
        socketRef.current.on("room_full", () => {
          console.log("room full");
          //redirect no room page
          window.location.href = "/accessdenied/Room Full";
        });

        socketRef.current.on("other_users", (users) => {
          const peers = [];
          users.forEach((user) => {
            const peer = createPeer(
              user.socketId,
              user.userId,
              user.userName,
              socketRef.current.id,
              stream
            );
            peer.isMicrophoneOpen = user.isMicrophoneOpen;
            peer.isCameraOpen = user.isCameraOpen;
            peersRef.current.push({
              peerID: user.socketId,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("new_join", (payload) => {
          setChats((prevState) => [
            ...prevState,
            { type: 0, message: `${payload.userName} joined room.` },
          ]);
          const peer = addPeer(
            payload.signal,
            payload.userId,
            payload.userName,
            payload.callerID,
            stream
          );

          //
          peer.isMicrophoneOpen = payload.isMicrophoneOpen;
          peer.isCameraOpen = payload.isCameraOpen;

          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });
        socketRef.current.on("receive_returned_signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
    socketRef.current.on("user_left", (userId) => {
      setPeers((prevState) =>
        prevState.filter((peer) => {
          if (peer.userId === userId) {
            setChats((prevState) => [
              ...prevState,
              { type: 0, message: `${peer.userName} left room.` },
            ]);
          }
          return peer.userId !== userId;
        })
      );
    });

    socketRef.current.on("set_new_user_name", (payload) => {
      let message = {
        type: 0,
        message: `${payload.oldName} changed name as ${payload.newName}`,
      };
      setPeers((prevState) => {
        return prevState.map((peer) => {
          if (peer.userId === payload.userId) {
            peer.userName = payload.newName;
          }
          return peer;
        });
      });
      setChats((prevState) => [...prevState, message]);
    });

    socketRef.current.on("recieve_message", (payload) => {
      let message = {
        type: 1,
        message: payload.message,
        sender: payload.sender,
      };
      setChats((prevState) => [...prevState, message]);
    });

    socketRef.current.on("set_changed_video_settings", (payload) => {
      setPeers((prevState) => [
        ...prevState.map((peer) => {
          if (peer.userId === payload.userId) {
            let p = peer;
            p.isCameraOpen = payload.isCameraOpen;
            p.isMicrophoneOpen = payload.isMicrophoneOpen;
            return p;
          }
          return peer;
        }),
      ]);
    });

    return () => {
      peers.forEach((peer) => {
        peer.close();
      });
      socketRef.current.disconnect();
    };
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  function createPeer(userToSignal, userId, userName, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.userId = userId;
    peer.userName = userName;

    peer.on("signal", (signal) => {
      socketRef.current.emit("send_signal", {
        userToSignal,
        callerID,
        signal,
        isCameraOpen: stream.getVideoTracks()[0].enabled,
        isMicrophoneOpen: stream.getAudioTracks()[0].enabled,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, userId, userName, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.userId = userId;
    peer.userName = userName;

    peer.on("signal", (signal) => {
      socketRef.current.emit("return_signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  useEffect(() => {
    socketRef.current.emit("change_video_settings", {
      roomId,
      isMicrophoneOpen,
      isCameraOpen,
    });
    return () => {};
  }, [isMicrophoneOpen, isCameraOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  function closeCall() {
    window.location.href = "/";
  }

  return (
    <div className={classes["page"]}>
      <Header
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
      />
      <div
        style={{ width: isSidebarOpen ? "calc(100% - 300px)" : "100%" }}
        className={classes["videos"]}
      >
        <MyVideo
          srcObject={srcObject}
          name={name}
          isCameraOpen={isCameraOpen}
          isMicrophoneOpen={isMicrophoneOpen}
        />
        {peers.map((peer, index) => {
          return <Video key={index} peer={peer} socketRef={socketRef} />;
        })}
        <div className={classes["video-bar"]}>
          <i
            onClick={() => setIsMicrophoneOpen(true)}
            style={{ display: isMicrophoneOpen ? "none" : "inline-flex" }}
            className={`fas fa-microphone-slash ${classes["microphone"]}`}
          ></i>
          <i
            onClick={() => setIsMicrophoneOpen(false)}
            style={{ display: isMicrophoneOpen ? "inline-flex" : "none" }}
            className={`fas fa-microphone ${classes["microphone"]}`}
          ></i>
          <i
            onClick={() => setIsCameraOpen(true)}
            style={{ display: isCameraOpen ? "none" : "inline-flex" }}
            className={`fas fa-video-slash ${classes["video"]}`}
          ></i>
          <i
            onClick={() => setIsCameraOpen(false)}
            style={{ display: isCameraOpen ? "inline-flex" : "none" }}
            className={`fas fa-video ${classes["video"]}`}
          ></i>
          <i
            onClick={closeCall}
            className={`fas fa-phone-slash ${classes["phone"]}`}
          ></i>
        </div>
      </div>
      <Sidebar
        isMicrophoneOpen={isMicrophoneOpen}
        isSidebarOpen={isSidebarOpen}
        isCameraOpen={isCameraOpen}
        socketRef={socketRef}
        setChats={setChats}
        setName={setName}
        roomId={roomId}
        chats={chats}
        peers={peers}
        name={name}
      />
    </div>
  );
}
