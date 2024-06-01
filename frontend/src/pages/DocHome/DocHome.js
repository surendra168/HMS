import React from "react";
import classes from "./docHome.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function DocHome() {
  const { user, logout } = useAuth();
  return (
    <div className={classes.wrapper}>
      <div className={classes.sidebar}>
        <ul>
          <li>
            <div className={classes.sideButton}>
              <Link to="/docViewAppt">Appointments</Link>
            </div>
          </li>
          <li>
            <div className={classes.sideButton}>
              <Link to="/MedHistView">View Patients</Link>
            </div>
          </li>
          <li>
            <div className={classes.sideButton}>
              <Link to="/settings">Settings</Link>
            </div>
          </li>
          <li>
            <div className={classes.sideButton}>
              <Link to="/" onClick={logout}>
                Sign out
              </Link>
            </div>
          </li>
        </ul>
      </div>

      <div className={classes.mainContent}>
        <h1>Welcome Dr. {user.name}</h1>
      </div>
    </div>
  );
}
