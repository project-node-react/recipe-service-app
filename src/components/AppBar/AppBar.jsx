import { Link } from "react-router-dom";
import Container from "../Container/Container";
import { Navigation } from "../Navigation/Navigation";
import style from "./AppBar.module.css";

export const AppBar = () => {
  return (
    <header className={style.header}>
      <Container>
        <div className={style.header__box}>
          <Link
            to="/"
            className={style.header__logo}
            aria-label="to the main page"
          >
            <p>TO THE MAIN PAGE</p>
          </Link>
          <Navigation />
        </div>
      </Container>
    </header>
  );
};
