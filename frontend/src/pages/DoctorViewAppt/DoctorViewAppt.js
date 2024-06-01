import React, { useEffect, useState } from "react";
import classes from "./doctorViewAppt.module.css";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

export default function DoctorViewAppt() {
  const [apptList, setApptList] = useState([]);
  const { user, getApptListDoc, deleteAppointment } = useAuth();

  useEffect(() => {
    getApptListDoc(user.email).then((apptList) => {
      setApptList(apptList);
    });
    // console.log(apptList);
  }, [user.email]);

  const deleteAppt = async (apptId) => {
    await deleteAppointment(apptId);
    window.location.reload();
  };

  const AppointmentTable = () => {
    return (
      <div className={classes.appointmentTable}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Concerns</th>
              <th>Symptoms</th>
              <th>Status</th>
              <th>Update/Submit Diagnosis</th>
              <th>Cancel Appointment</th>
            </tr>
          </thead>
          <tbody>
            {apptList.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.name}</td>
                <td>
                  {new Date(appointment.date)
                    .toLocaleDateString()
                    .substring(0, 10)}
                </td>
                <td>{appointment.starttime}</td>
                <td>{appointment.endtime}</td>
                <td>{appointment.concerns}</td>
                <td>{appointment.symptoms}</td>
                <td>{appointment.status}</td>
                <td>
                  <Link to={`/diagnosis/${appointment.id}`}>
                    <button type="button" className={classes.diagnoseButton}>
                      Diagnose
                    </button>
                  </Link>
                </td>
                {appointment.status === "NotDone" ? (
                  <td>
                    <button
                      type="button"
                      className={classes.diagnoseButton}
                      onClick={() => deleteAppt(appointment.id)}
                    >
                      Cancel
                    </button>
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  return <AppointmentTable />;
}
