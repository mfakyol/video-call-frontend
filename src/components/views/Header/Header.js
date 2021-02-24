import React from "react";
import { Link } from "react-router-dom";
import classes from "./style.module.css";

export default function Header({ setIsSidebarOpen, isSidebarOpen }) {
  return (
    <header className={classes["header"]}>
      <nav className={classes["navbar"]}>
        <Link className={classes["logo"]} to="/">
          Video Chat
        </Link>
        <i
          style={{ display: isSidebarOpen ? "none" : "inline-block" }}
          onClick={() => setIsSidebarOpen(true)}
          className="far fa-comment-alt"
        ></i>
        <i
          style={{ display: isSidebarOpen ? "inline-block" : "none" }}
          onClick={() => setIsSidebarOpen(false)}
          className="fas fa-comment-alt"
        ></i>
      </nav>
    </header>
  );
}
