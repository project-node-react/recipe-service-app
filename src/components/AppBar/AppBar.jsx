import Container from "../Container/Container";
import { Navigation } from "../Navigation/Navigation";
import Logo from "../Logo/Logo";
import style from "./AppBar.module.css";

export const AppBar = () => {
  return (
    <header className={style.header}>
      <Container>
        <div className={style.header__box}>
          <Logo />
          <Navigation />
        </div>
      </Container>
    </header>
  );
};
