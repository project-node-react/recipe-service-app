import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import defaultAvatar from "../../assets/profile.png";
import style from "./UserBar.module.css";

export default function UserBar({ onLogOut, isOpen = false, onToggle }) {
  const user = useSelector(selectUser);
  const userBarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (userBarRef.current && !userBarRef.current.contains(event.target)) {
        onToggle?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div
      className={style.user_bar}
      onClick={onToggle ? onToggle : undefined}
      role="presentation"
      ref={userBarRef}
    >
      <div className={style.user_bar__action}>
        <img
          className={style.user_bar__avatar}
          src={user?.avatar || user?.avatarURL || defaultAvatar}
          alt={user?.name || "User avatar"}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = defaultAvatar;
          }}
        />

        <p className={style.user_bar__name}>{user?.name}</p>

        <svg
          className={clsx(style.user_bar__chevron, isOpen && style.chevron_up)}
          aria-hidden="true"
        >
          <use href={`${import.meta.env.BASE_URL}icons.svg#chevron-down`} />
        </svg>
      </div>

      {isOpen && (
        <ul className={style.dropdown}>
          <li>
            <Link to={`/user/${user.id}`} className={style.dropdown__item}>
              Profile
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={style.dropdown__item}
              onClick={onLogOut}
            >
              Log out
              <svg className={style.dropdown__icon} aria-hidden="true">
                <use
                  href={`${import.meta.env.BASE_URL}icons.svg#arrow-up-right`}
                />
              </svg>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
