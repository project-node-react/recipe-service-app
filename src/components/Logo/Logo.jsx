import { Link } from "react-router-dom";
import clsx from "clsx";
import style from "./Logo.module.css";

export default function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      className={clsx(style.logo, className)}
      aria-label="To the main page"
    >
      foodies
    </Link>
  );
}
