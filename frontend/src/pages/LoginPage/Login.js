import React, { useEffect } from "react";
import classes from "./login.module.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (!user) return;

    let path = user.isDoc ? "/DocHome" : "/PatientHome";
    navigate(path);
  }, [user]);

  const submit = async ({ email, password, isDoc }) => {
    await login(email, password, isDoc);
  };

  return (
    <div className={classes.loginContainer}>
      <form onSubmit={handleSubmit(submit)} noValidate>
        <div className={classes.formComponent}>
          <label>Email:</label>
          <input
            type="email"
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
          <label>Password:</label>
          <input
            type="password"
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
          <label className={classes.check}>
            <input type="checkbox" {...register("isDoc")} />
            I'm a doctor
          </label>
        </div>

        <div className={classes.formComponent}>
          <button type="submit" className={classes.loginButton}>
            Login
          </button>
        </div>

        <div className={[classes.formComponent, classes.register].join(" ")}>
          New user? &nbsp;
          <Link to={"/registerPatient"}>Register here</Link>
        </div>
      </form>
    </div>
  );
}
