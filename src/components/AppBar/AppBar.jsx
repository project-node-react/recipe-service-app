import { useState } from "react";
import { useSelector } from "react-redux";
import Container from "../Container/Container";
import { Navigation } from "../Navigation/Navigation";
import Logo from "../Logo/Logo";
import SignInModal from "../SignInModal/SignInModal";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import style from "./AppBar.module.css";

export const AppBar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header className={style.header}>
      <Container>
        <div className={style.header__box}>
          <Logo />
          <Navigation />
          {!isLoggedIn && (
            <button
              type="button"
              className={style.signIn}
              onClick={() => setIsSignInOpen(true)}
            >
              Sign in
            </button>
          )}
        </div>
      </Container>
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </header>
  );
};
