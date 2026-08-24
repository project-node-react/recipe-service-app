import style from "./AuthBar.module.css";

export default function AuthBar({ onSignIn, onSignUp }) {
  return (
    <div className={style.auth_bar}>
      <button
        type="button"
        className={style.sign_in}
        onClick={onSignIn}
      >
        Sign in
      </button>
      <button
        type="button"
        className={style.sign_up}
        onClick={onSignUp}
      >
        Sign up
      </button>
    </div>
  );
}
