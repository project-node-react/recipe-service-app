import Container from "../Container/Container";
import Logo from "../Logo/Logo";
import NetworkLinks from "../NetworkLinks/NetworkLinks";
import style from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <Container>
        <div className={style.footer__top}>
          <Logo />
          <NetworkLinks />
        </div>

        <p className={style.footer__copyright}>
          @2026, Foodies. All rights reserved
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
