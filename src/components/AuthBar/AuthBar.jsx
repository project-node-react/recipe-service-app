import clsx from "clsx";
import style from "./AuthBar.module.css";

export default function AuthBar({ activeModal = "", onSignIn, onSignUp }) {
  return (
    <div
      className={clsx(
        style.auth_bar,
        activeModal === "signin" && style.auth_bar__signin,
        activeModal === "signup" && style.auth_bar__signup,
      )}
    >
      <button type="button" className={style.sign_in} onClick={onSignIn}>
        Sign in
      </button>
      <button type="button" className={style.sign_up} onClick={onSignUp}>
        Sign up
      </button>
    </div>
  );
}
