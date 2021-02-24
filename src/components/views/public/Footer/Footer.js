import React from 'react'
import { Link } from 'react-router-dom'
import classes from './style.module.css'

export default function Footer() {
    return (
        <footer className={classes["footer"]}>
            <div className={classes["links"]}>
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
                <a href="/">Github</a>
            </div>
        </footer>
    )
}
