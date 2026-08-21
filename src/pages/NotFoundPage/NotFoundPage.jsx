import { Link } from "react-router-dom";

import style from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={style.NotFoundPage}>
      <h2 className={style.warning}>404 Page not found!</h2>
      <Link to={`/`} className={style.link}>
        Link to Home Page
      </Link>
    </div>
  );
}
