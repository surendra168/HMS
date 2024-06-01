import React, { useEffect } from "react";
import classes from "./diagnose.module.css";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Link, useParams } from "react-router-dom";

export default function Diagnose() {
  const auth = useAuth();
  const { user, getDiagnosis, fillDiagnosis } = auth;
  const { appointmentId } = useParams();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getDiagnosis(appointmentId).then((prev) => {
      setValue("diagnosis", prev.diagnosis);
      setValue("prescription", prev.prescription);
    });
  }, [appointmentId]);

  const DiagnosisField = () => {
    return (
      <div className={classes.formComponent}>
        <label htmlFor="diagnosis">Diagnosis</label>
        <textarea
          id="diagnosis"
          {...register("diagnosis", {
            required: "Please fill this field",
          })}
        />
        {errors.diagnosis && (
          <p className={classes.error}>{errors.diagnosis.message}</p>
        )}
      </div>
    );
  };

  const Prescription = () => {
    return (
      <div className={classes.formComponent}>
        <label htmlFor="prescription">Prescription</label>
        <textarea
          id="prescription"
          {...register("prescription", {
            required: "Please fill this field",
          })}
        />
        {errors.prescription && (
          <p className={classes.error}>{errors.prescription.message}</p>
        )}
      </div>
    );
  };

  const submit = async (data) => {
    await fillDiagnosis({ ...data, apptId: appointmentId });
  };

  return (
    <div className={classes.diagnosisWrapper}>
      <h3>Diagnosis Form</h3>
      <div className={classes.diagnosisContainer}>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <DiagnosisField />
          <Prescription />

          <button type="submit" className={classes.submit}>
            Submit diagnosis
          </button>
        </form>
      </div>
    </div>
  );
}
