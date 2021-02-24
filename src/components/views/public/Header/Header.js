import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import classes from "./style.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)



    return (
        <header style ={{maxHeight: isOpen ? "2000px": "60px"}} className={classes["header"]}>
        <nav className={classes["navbar"]}>
          <Link className={classes["logo"]} to="/">
            Video Chat
          </Link>
          <i onClick={() => setIsOpen(!isOpen)} className={`${classes["menu-icon"]} fas fa-bars`}></i>
          <div className={classes["nav-items"]}>
              <Link className={classes["nav-item"]} to ="/">Home</Link>
              <Link className={classes["nav-item"]} to ="/about">About</Link>
              <Link className={classes["nav-item"]} to ="/contact">Contact</Link>
          </div>
          <div className={classes["nav-items"]}>
          <Link className={classes["nav-login"]} to ="/login">Log In</Link>
          <Link className={classes["nav-signup"]} to ="/signup">Sign Up</Link>
          </div>
        </nav>
      </header>
    )
}
