import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import defaultAvatar from "../../assets/profile.png";
import { followUser, unfollowUser } from "../../redux/users/operations";
import { selectFollowPendingId, selectIsFollowing } from "../../redux/users/selectors";
import { selectUser } from "../../redux/auth/selectors";
import style from "./UserCard.module.css";

// Рядок юзера для вкладок Followers / Following.
// ВАЖЛИВО: бекенд (за підтвердженою схемою /users/{id}/followers та
// /users/following) віддає на кожен елемент лише { id, name, avatar } —
// ні recipesCount, ні прев'ю останніх рецептів там немає. Ці два блоки
// нижче зроблені захисно (рендеряться, лише якщо поле реально прийшло) і
// запрацюють, коли бекенд-команда додасть їх у відповідь — те саме
// прохання, що й про пагінацію followers/following.
export default function UserCard({ user }) {
  const dispatch = useDispatch();
  const authUser = useSelector(selectUser);
  const followPendingId = useSelector(selectFollowPendingId);
  const isFollowing = useSelector((state) => selectIsFollowing(state, user.id));

  const isSelf = authUser?.id && String(authUser.id) === String(user.id);
  const isPending = followPendingId === user.id;
  const recentRecipes = user.recipes || [];

  const handleFollowClick = () => {
    const action = isFollowing ? unfollowUser(user.id) : followUser(user.id);

    dispatch(action)
      .unwrap()
      .catch((error) => toast.error(error || "Something went wrong"));
  };

  return (
    <article className={style.card}>
      <img
        className={style.avatar}
        src={user.avatar || defaultAvatar}
        alt={user.name || "User avatar"}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = defaultAvatar;
        }}
      />

      <div className={style.info}>
        <p className={style.name}>{user.name}</p>
        {user.recipesCount != null && (
          <p className={style.recipesCount}>Own recipes: {user.recipesCount}</p>
        )}

        {!isSelf && (
          <button
            type="button"
            className={clsx(style.followBtn, isFollowing && style.followBtnActive)}
            onClick={handleFollowClick}
            disabled={isPending}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      {recentRecipes.length > 0 && (
        <ul className={style.recipesPreview}>
          {recentRecipes.slice(0, 4).map((recipe) => (
            <li key={recipe.id}>
              <img
                className={style.recipeThumb}
                src={recipe.thumb || "/foodicon.svg"}
                alt={recipe.title || ""}
              />
            </li>
          ))}
        </ul>
      )}

      <Link
        className={style.link}
        to={`/user/${user.id}`}
        aria-label={`Open profile of ${user.name}`}
      >
        <svg className={style.icon} aria-hidden="true">
          <use href={`${import.meta.env.BASE_URL}icons.svg#arrow-up-right`} />
        </svg>
      </Link>
    </article>
  );
}
