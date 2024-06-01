import React, { useEffect, useState } from "react";
import classes from "./viewDiagnosis.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

export default function ViewDiagnosis() {
  const [diagnosisData, setDiagnosisData] = useState([]);
  const { appointmentId } = useParams();
  const { getDiagnosis } = useAuth();

  useEffect(() => {
    getDiagnosis(appointmentId).then((data) => {
      setDiagnosisData(data);
    });
  }, [appointmentId]);

  const DiagnosisTable = () => {
    return (
      <div className={classes.diag}>
        <table>
          <tbody>
            <tr>
              <td className={classes.heading}>
                <strong>Appointment Id:</strong>
              </td>
              <td>{diagnosisData.appt}</td>
            </tr>

            <tr>
              <td className={classes.heading}>
                <strong>Doctor:</strong>
              </td>
              <td>{diagnosisData.name}</td>
            </tr>

            <tr>
              <td className={classes.heading}>
                <strong>Diagnosis:</strong>
              </td>
              <td>{diagnosisData.diagnosis}</td>
            </tr>

            <tr>
              <td className={classes.heading}>
                <strong>Prescription:</strong>
              </td>
              <td>{diagnosisData.prescription}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return <DiagnosisTable />;
}
