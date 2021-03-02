import React from "react";
import { Link } from "react-router-dom";
import classes from "./style.module.css";

export default function AccessDenied({ match }) {
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
        <p>{match.params.type}</p>
      </div>
    </>
  );
}
