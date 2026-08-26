import { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Modal from "../Modal/Modal";
import { logIn } from "../../redux/auth/operations";
import style from "./SignInModal.module.css";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignInModal({ isOpen, onClose, onCreateAccount }) {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
    },
    validationSchema,
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign in">
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
          className={style.submit}
          type="submit"
          disabled={formik.isSubmitting}
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
