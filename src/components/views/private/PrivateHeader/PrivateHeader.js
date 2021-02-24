import React from 'react'
import { Link } from 'react-router-dom'
import classes from './style.module.css'

export default function PrivateHeader() {
    return (
        <header className={classes["header"]}>
        <nav className={classes["navbar"]}>
          <Link className={classes["logo"]} to="/rooms">
            Video Chat
          </Link>

        </nav>
      </header>
    )
}
