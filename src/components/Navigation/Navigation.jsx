import { NavLink } from "react-router-dom";
import clsx from "clsx";
import style from "./Navigation.module.css";

const buildLinkClass = ({ isActive }) =>
  clsx(style.nav_link, isActive && style.active);

export const Navigation = ({ className = "", onNavigate }) => {
  return (
    <nav>
      <ul className={clsx(style.nav_list, className)}>
        <li>
          <NavLink
            className={buildLinkClass}
            to="/"
            aria-label="to the main page"
            onClick={onNavigate}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={buildLinkClass}
            to="/recipe/add"
            aria-label="to the add recipe page"
            onClick={onNavigate}
          >
            Add recipe
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
