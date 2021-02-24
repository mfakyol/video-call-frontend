import React, { useState } from "react";
import classes from "./style.module.css";

export default function Sidebar(props) {
  const {
    isSidebarOpen,
    peers,
    chats,
    setChats,
    socketRef,
    name,
    setName,
    roomId,
    isMicrophoneOpen,
    isCameraOpen,
  } = props;

  const [message, setMessage] = useState("");
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  function messageOnChange(e) {
    setMessage(e.target.value);
  }

  function nameOnChange(e) {
    setEditedName(e.target.value);
  }

  function changeName() {
    if (editedName !== name) {
      socketRef.current.emit("change_name", {
        editedName,
        oldName: name,
        roomId,
      });
      setName(editedName);
    }
    setIsNameEditing(false);
  }

  function sendMessage(e) {
    if (message.trim()) {
      socketRef.current.emit("send_message", { message, sender: name, roomId });
      setChats((prevState) => [...prevState, { sender: "You", message }]);
      setMessage("");
    }
  }

  return (
    <aside
      style={{ display: isSidebarOpen ? "block" : "none" }}
      className={classes["sidebar"]}
    >
      <div className={classes["user-block"]}>
        <h2 className={classes["users-header"]}>Users</h2>
        <div className={classes["my-user-row-container"]}>
          <div
            className={classes["my-user-row"]}
            style={{ display: isNameEditing ? "none" : "flex" }}
          >
            <span>
              <i
                style={{ display: isCameraOpen ? "inline-flex" : "none" }}
                className={`${classes["open"]} fas fa-video`}
              ></i>
              <i
                style={{ display: isCameraOpen ? "none" : "inline-flex" }}
                className={`${classes["close"]} fas fa-video-slash`}
              ></i>
              <i
                style={{ display: isMicrophoneOpen ? "inline-flex" : "none" }}
                className={`${classes["open"]} fas fa-microphone`}
              ></i>
              <i
                style={{ display: isMicrophoneOpen ? "none" : "inline-flex" }}
                className={`${classes["close"]} fas fa-microphone-slash`}
              ></i>
              You ({name})
            </span>
            <button
              className={classes["rename"]}
              onClick={() => setIsNameEditing(true)}
            >
              Rename
            </button>
          </div>
          <div
            className={classes["edit-row"]}
            style={{ display: isNameEditing ? "flex" : "none" }}
          >
            <input value={editedName} onChange={nameOnChange} type="text" />{" "}
            <button
              className={classes["cancel"]}
              onClick={() => {
                setEditedName(name);
                setIsNameEditing(false);
              }}
            >
              Cancel
            </button>
            <button className={classes["save"]} onClick={changeName}>
              Save
            </button>
          </div>
        </div>
        <div className={classes["users"]}>
          {peers.map((peer) => (
            <span className={classes["user-row"]} key={peer.userId}>
              <i
                style={{ display: peer.isCameraOpen ? "inline-flex" : "none" }}
                className={`${classes["open"]} fas fa-video`}
              ></i>
              <i
                style={{ display: peer.isCameraOpen ? "none" : "inline-flex" }}
                className={`${classes["close"]} fas fa-video-slash`}
              ></i>
              <i
                style={{
                  display: peer.isMicrophoneOpen ? "inline-flex" : "none",
                }}
                className={`${classes["open"]} fas fa-microphone`}
              ></i>
              <i
                style={{
                  display: peer.isMicrophoneOpen ? "none" : "inline-flex",
                }}
                className={`${classes["close"]} fas fa-microphone-slash`}
              ></i>
              {peer.userName}
            </span>
          ))}
        </div>
      </div>
      <div className={classes["chat-block"]}>
        <h2 className={classes["chats-header"]}>Chats</h2>
        <div className={classes["chats"]}>
          {chats.map((chat, index) =>
            chat.type === 0 ? (
              <span key={index} className={classes["info"]}>
                {chat.message}
              </span>
            ) : (
              <span key={index} className={classes["message"]}>
                <b>{chat.sender}: </b>
                {chat.message}
              </span>
            )
          )}
        </div>
        <div className={classes["chat-input-area"]}>
          <input
            value={message}
            onChange={messageOnChange}
            name="message"
            className={classes["chat-input"]}
            type="text"
          />
          <button
            onClick={sendMessage}
            className={classes["chat-input-button"]}
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}
