import { useState } from "react";
import { useSelector } from "react-redux";
import Container from "../Container/Container";
import { Navigation } from "../Navigation/Navigation";
import Logo from "../Logo/Logo";
import SignUpModal from "../SignUpModal/SignUpModal";
import SignInModal from "../SignInModal/SignInModal";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import style from "./AppBar.module.css";

export const AppBar = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header className={style.header}>
      <Container>
        <div className={style.header__box}>
          <Logo />
          <Navigation />
          {!isLoggedIn && (
            <ul className={style.authBtnsList}>
              <li className={style.authBtnsListItem}>
                <button
                  type="button"
                  className={style.signIn}
                  onClick={() => setIsSignInOpen(true)}
                >
                  Sign in
                </button>
              </li>
              <li className={style.authBtnsListItem}>
                <button
                  type="button"
                  className={style.signUp}
                  onClick={() => setIsSignUpOpen(true)}
                >
                  Sign up
                </button>
              </li>
            </ul>
          )}
        </div>
      </Container>
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onCreateAccount={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSignInAccount={() => {
          setIsSignInOpen(true);
          setIsSignUpOpen(false);
        }}
      />
    </header>
  );
};
