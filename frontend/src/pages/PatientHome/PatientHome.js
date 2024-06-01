import React from "react";
import classes from "./patientHome.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PatientHome() {
  const { user, logout } = useAuth();
  return (
    <div className={classes.wrapper}>
      <div className={classes.sidebar}>
        <ul>
          <li>
            <div className={classes.sideButton}>
              <Link to="/viewMedicHistory">View Medical History</Link>
            </div>
          </li>

          <li>
            <div className={classes.sideButton}>
              <Link to="/patientsViewAppt">View Appointments</Link>
            </div>
          </li>

          <li>
            <div className={classes.sideButton}>
              <Link to="/scheduleAppt">Schedule Appointment</Link>
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
        <h1>Welcome {user.name}</h1>
      </div>
    </div>
  );
}
