import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import classes from "./scheduleAppt.module.css";

import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import DatePicker from "react-datepicker";

export default function ScheduleAppt() {
  const auth = useAuth();
  const { user, getDocInfo, attemptAppointment } = auth;

  const [doctorsList, setList] = useState([]);

  const today = new Date();

  const {
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getDocInfo().then((docInfo) => setList(docInfo));
  }, []);

  const DocDropdown = () => {
    return (
      <>
        <div className={classes.formComponent}>
          <label htmlFor="docEmail">Select Doctor</label>
          <select
            id="docEmail"
            {...register("docEmail", {
              required: "Doctor selection is required",
            })}
          >
            <option value="">Select Doctor</option>
            {doctorsList.map((doc) => {
              let val = `${doc.name} (${doc.email})`;
              return (
                <option key={val} value={doc.email}>
                  {val}
                </option>
              );
            })}
          </select>
          {errors.docEmail && (
            <p className={classes.error}>{errors.docEmail.message}</p>
          )}
        </div>
      </>
    );
  };

  const DateAppt = () => {
    return (
      <div className={classes.formComponent}>
        <label>Date:</label>
        <Controller
          name="startDate"
          control={control}
          rules={{ required: "Date of Appointment is required" }}
          render={({ field }) => (
            <>
              <DatePicker
                {...field}
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                minDate={today}
                dateFormat="dd/MM/yyyy"
              />
              {errors.startDate && (
                <p className={classes.error}>{errors.startDate.message}</p>
              )}
            </>
          )}
        />
      </div>
    );
  };

  const Time = () => {
    const validateEndTime = (value) => {
      const startValue = getValues("startTime");
      const endValue = getValues("endTime");

      if (!startValue || !endValue) {
        // Skip validation if either is missing
        return true;
      }

      const startDateTime = new Date(`2023-01-01 ${startValue}`);
      const endDateTime = new Date(`2023-01-01 ${endValue}`);

      const differenceInMinutes = (endDateTime - startDateTime) / (1000 * 60);

      return (
        differenceInMinutes >= 10 ||
        "End time must be at least 10 minutes greater than start time"
      );
    };
    return (
      <>
        <div className={classes.formComponent}>
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            {...register("startTime", {
              required: "Start Time is required",
            })}
          />
          {errors.startTime && (
            <p className={classes.error}>{errors.startTime.message}</p>
          )}
        </div>
        <div className={classes.formComponent}>
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            {...register("endTime", {
              required: "End Time is required",
              validate: validateEndTime,
            })}
          />
          {errors.endTime && (
            <p className={classes.error}>{errors.endTime.message}</p>
          )}
        </div>
      </>
    );
  };

  const ConcernField = () => {
    return (
      <div className={classes.formComponent}>
        <label htmlFor="concerns">Concerns</label>
        <textarea
          id="concerns"
          {...register("concerns", {
            required: "Please fill this field",
          })}
        />
        {errors.concerns && (
          <p className={classes.error}>{errors.concerns.message}</p>
        )}
      </div>
    );
  };

  const SymptomField = () => {
    return (
      <div className={classes.formComponent}>
        <label htmlFor="symptoms">Symptoms</label>
        <textarea
          id="symptoms"
          {...register("symptoms", {
            required: "Please fill this field",
          })}
        />
        {errors.symptoms && (
          <p className={classes.error}>{errors.symptoms.message}</p>
        )}
      </div>
    );
  };

  const submit = async (data) => {
    console.log(data);
    await attemptAppointment({ ...data, patientEmail: user.email });
  };

  return (
    <div className={classes.apptWrapper}>
      <h3>Schedule Appointment</h3>
      <div className={classes.apptContainer}>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <DocDropdown />
          <DateAppt />
          <Time />
          <ConcernField />
          <SymptomField />
          <button type="submit" className={classes.submit}>
            Attempt to Schedule
          </button>
        </form>
      </div>
    </div>
  );
}
