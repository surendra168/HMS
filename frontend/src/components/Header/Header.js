import React from "react";
import { Link } from "react-router-dom";
import classes from "./header.module.css";

export default function Header() {
  return (
    <header className={classes.header}>
      <Link to="/" className={classes.logo}>
        <h3>HMS</h3>
      </Link>
    </header>
  );
}
