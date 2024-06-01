import React, { useEffect } from "react";
import classes from "./registerPatient.module.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPatient() {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!user) return;

    let path = user.isDoc ? "/DocHome" : "/PatientHome";
    navigate(path);
  }, [user]);

  const submit = async (data) => {
    console.log(data);
    await auth.register(data, false);
  };
  return (
    <div className={classes.registerWrapper}>
      <h3>Patient Registration form</h3>
      <div className={classes.registerContainer}>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <div className={classes.formComponent}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              {...register("firstName", { required: "First Name is required" })}
            />
            {errors.firstName && (
              <p className={classes.error}>{errors.firstName.message}</p>
            )}
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              {...register("lastName", { required: "Last Name is required" })}
            />
            {errors.lastName && (
              <p className={classes.error}>{errors.lastName.message}</p>
            )}
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              {...register("gender", { required: "Gender is required" })}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className={classes.error}>{errors.gender.message}</p>
            )}
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="conditions">Medical History - Conditions</label>
            <textarea id="conditions" {...register("conditions")} />
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="surgeries">Medical History - Surgeries</label>
            <textarea id="surgeries" {...register("surgeries")} />
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="medications">Medical History - Medications</label>
            <textarea id="medications" {...register("medications")} />
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              {...register("address", { required: "Address is required" })}
            />
            {errors.address && (
              <p className={classes.error}>{errors.address.message}</p>
            )}
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className={classes.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className={classes.error}>{errors.password.message}</p>
            )}
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className={classes.error}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className={classes.buttonContainer}>
            <Link to="/">
              <button type="button">Cancel</button>
            </Link>
            <button type="submit">Register</button>
          </div>

          <div className={classes.forDoctor}>
            Are you a Doctor?
            <br />
            <Link to={"/registerDoc"}>Yes, I am</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
