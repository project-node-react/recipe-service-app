import { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Modal from "../Modal/Modal";
import { logIn } from "../../redux/auth/operations";
import style from "./SignInModal.module.css";

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegExp, "Email is not valid.")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignInModal({ isOpen, onClose, onCreateAccount }) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(logIn(values)).unwrap();
        resetForm();
        onClose();
      } catch (error) {
        toast.error(error || "Unable to sign in");
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setShowPassword(false);
    onClose();
  };

  const isSubmitDisabled = !formik.isValid || !formik.dirty || formik.isSubmitting;
  const isSubmitReady = !isSubmitDisabled;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign in">
      <form className={style.form} onSubmit={formik.handleSubmit}>
        <div className={style.fields}>
          <label className={style.field}>
            <input
              className={style.input}
              type="email"
              name="email"
              placeholder="Email*"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <span className={style.error}>{formik.errors.email}</span>
            ) : null}
          </label>

          <label className={style.field}>
            <span className={style.passwordWrap}>
              <input
                className={style.input}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password*"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                className={style.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg className={style.toggleIcon} aria-hidden="true">
                  <use
                    href={`${import.meta.env.BASE_URL}icons.svg#${showPassword ? "eye-off" : "eye"}`}
                  />
                </svg>
              </button>
            </span>
            {formik.touched.password && formik.errors.password ? (
              <span className={style.error}>{formik.errors.password}</span>
            ) : null}
          </label>
        </div>

        <button
          className={`${style.submit} ${isSubmitReady ? style.active : ""}`}
          type="submit"
          disabled={isSubmitDisabled}
        >
          Sign in
        </button>
      </form>

      <p className={style.secondary}>
        Don&apos;t have an account?{" "}
        <button
          type="button"
          className={style.secondaryCta}
          onClick={onCreateAccount}
        >
          Create an account
        </button>
      </p>
    </Modal>
  );
}
