import React, { useEffect, useReducer } from "react";
import classes from "./viewOneHist.module.css";
import { useAuth } from "../../hooks/useAuth";

const initialState = { medicalHistory: [], diagnosisHistory: [] };

const reducer = (state, action) => {
  switch (action.type) {
    case "MEDIC_LOADED":
      return { ...state, medicalHistory: action.payload };
    case "DIAGNOSIS_LOADED":
      return { ...state, diagnosisHistory: action.payload };
    default:
      return state;
  }
};

export default function ViewOneHist() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { medicalHistory, diagnosisHistory } = state;
  const { user, getHistoryPatient, getDiagnosisPatient } = useAuth();

  useEffect(() => {
    getHistoryPatient(user.email).then((history) =>
      dispatch({ type: "MEDIC_LOADED", payload: history })
    );
    getDiagnosisPatient(user.email).then((diag) =>
      dispatch({ type: "DIAGNOSIS_LOADED", payload: diag })
    );
  }, [user.email]);

  const PatientProfile = () => {
    return (
      <div className={classes.patientProfile}>
        <table>
          <tbody>
            <tr>
              <td className={classes.heading}>
                <strong>Name:</strong>
              </td>
              <td>{medicalHistory.name}</td>
              <td className={classes.heading}>
                <strong>Email:</strong>
              </td>
              <td>{medicalHistory.email}</td>
            </tr>
            <tr>
              <td className={classes.heading}>
                <strong>Gender:</strong>
              </td>
              <td>{medicalHistory.gender}</td>
              <td className={classes.heading}>
                <strong>Address:</strong>
              </td>
              <td>{medicalHistory.address}</td>
            </tr>
            <tr>
              <td className={classes.heading}>
                <strong>Conditions:</strong>
              </td>
              <td>{medicalHistory.conditions}</td>
            </tr>
            <tr>
              <td className={classes.heading}>
                <strong>Surgeries:</strong>
              </td>
              <td>{medicalHistory.surgeries}</td>
            </tr>
            <tr>
              <td className={classes.heading}>
                <strong>Medication:</strong>
              </td>
              <td>{medicalHistory.medication}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const AllDiagnosis = () => {
    return (
      <>
        {diagnosisHistory.map((diag) => (
          <div className={classes.patientProfile}>
            <table>
              <tbody>
                <tr>
                  <td className={classes.heading}>
                    <strong>Date:</strong>
                  </td>
                  <td>
                    {new Date(diag.date).toLocaleDateString().substring(0, 10)}
                  </td>
                  <td className={classes.heading}>
                    <strong>Doctor:</strong>
                  </td>
                  <td>{diag.name}</td>
                </tr>
                <tr>
                  <td className={classes.heading}>
                    <strong>Concerns:</strong>
                  </td>
                  <td>{diag.concerns}</td>
                </tr>
                <tr>
                  <td className={classes.heading}>
                    <strong>Symptoms:</strong>
                  </td>
                  <td>{diag.symptoms}</td>
                </tr>
                <tr>
                  <td className={classes.heading}>
                    <strong>Diagnosis:</strong>
                  </td>
                  <td>{diag.diagnosis}</td>
                </tr>
                <tr>
                  <td className={classes.heading}>
                    <strong>Prescription:</strong>
                  </td>
                  <td>{diag.prescription}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <PatientProfile />
      <AllDiagnosis />
    </>
  );
}
