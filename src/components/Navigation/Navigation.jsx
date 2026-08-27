import { NavLink } from "react-router-dom";
import clsx from "clsx";
import style from "./Navigation.module.css";

const buildLinkClass = (rev) => ({ isActive }) =>
  clsx(style.nav_link, isActive && style.active, rev && style.nav_link__rev);

export const Navigation = ({
  className = "",
  onNavigate,
  onProtectedClick,
  rev = false,
}) => {
  return (
    <nav>
      <ul className={clsx(style.nav_list, className)}>
        <li>
          <NavLink
            className={buildLinkClass(rev)}
            to="/"
            aria-label="to the main page"
            onClick={onNavigate}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={buildLinkClass(rev)}
            to="/recipe/add"
            aria-label="to the add recipe page"
            onClick={(e) => {
              if (onProtectedClick) {
                onProtectedClick(e);
              }
              if (onNavigate) {
                onNavigate(e);
              }
            }}
          >
            Add recipe
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
