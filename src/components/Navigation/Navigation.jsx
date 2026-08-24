import { NavLink } from "react-router-dom";
import clsx from "clsx";
import style from "./Navigation.module.css";

const getActiveClassNames = ({ isActive }) => clsx(isActive && style.active);

export const Navigation = () => {
  return (
    <nav>
      <ul className={style.nav_list}>
        <li>
          <NavLink
            className={getActiveClassNames}
            to="/"
            aria-label="to the main page"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={getActiveClassNames}
            to="/recipe/add"
            end
            aria-label="to the catalog page"
          >
            Add recipe
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
