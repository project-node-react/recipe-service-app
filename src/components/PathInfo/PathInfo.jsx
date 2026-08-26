import { Link } from "react-router-dom";

import styles from "./PathInfo.module.css";

export const PathInfo = ({ currentPage }) => {
  return (
    <div className={styles.pathInfo}>
      <Link className={styles.pathLink} to="/">
        Home
      </Link>
      <span aria-hidden="true"> / </span>
      <span className={styles.currentPath}>{currentPage}</span>
    </div>
  );
};