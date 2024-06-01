import React from "react";
import classes from "./settings.module.css";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

export default function Settings() {
  const auth = useAuth();
  const { user, changePassword } = auth;

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submit = async ({ oldPassword, newPassword }) => {
    await changePassword(oldPassword, newPassword, user.email, user.isDoc);
  };
  return (
    <div className={classes.settingWrapper}>
      <h3>Password Change</h3>
      <div className={classes.settingContainer}>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <div className={classes.formComponent}>
            <label htmlFor="password">Old Password</label>
            <input
              type="password"
              {...register("oldPassword", {
                required: "Old Password is required",
              })}
            />
            {errors.oldPassword && (
              <p className={classes.error}>{errors.oldPassword.message}</p>
            )}
          </div>

          <div className={classes.formComponent}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword", {
                required: "New Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.newPassword && (
              <p className={classes.error}>{errors.newPassword.message}</p>
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
                  value === getValues("newPassword") ||
                  "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className={classes.error}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}
