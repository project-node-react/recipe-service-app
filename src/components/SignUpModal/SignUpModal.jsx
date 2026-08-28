import { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Modal from "../Modal/Modal";
import { register } from "../../redux/auth/operations";
import style from "./SignUpModal.module.css";

const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .matches(emailRegExp, "Email is not valid.")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignUpModal({ isOpen, onClose, onSignInAccount }) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(register(values)).unwrap();
        resetForm();
        onClose();
      } catch (error) {
        toast.error(error || "Unable to sign up");
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign up">
      <form className={style.form} onSubmit={formik.handleSubmit}>
        <div className={style.fields}>
          <label className={style.field}>
            <input
              className={style.input}
              type="text"
              name="name"
              placeholder="Name*"
              autoComplete="username"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <span className={style.error}>{formik.errors.name}</span>
            ) : null}
          </label>

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
                autoComplete="new-password"
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
          className={style.submit}
          type="submit"
          disabled={formik.isSubmitting}
        >
          Create
        </button>
      </form>

      <p className={style.secondary}>
        I already have an account?{" "}
        <button
          type="button"
          className={style.secondaryCta}
          onClick={onSignInAccount}
        >
          Sign in
        </button>
      </p>
    </Modal>
  );
}
