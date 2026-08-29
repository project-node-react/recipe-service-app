import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import defaultAvatar from "../../assets/profile.png";
import {
  followUser,
  unfollowUser,
  fetchUserRecipesPreview,
} from "../../redux/users/operations";
import {
  selectFollowPendingId,
  selectIsFollowing,
  selectRecipesPreview,
} from "../../redux/users/selectors";
import { selectUser } from "../../redux/auth/selectors";
import style from "./UserCard.module.css";

export default function UserCard({ user }) {
  const dispatch = useDispatch();
  const authUser = useSelector(selectUser);
  const followPendingId = useSelector(selectFollowPendingId);
  const isFollowing = useSelector((state) => selectIsFollowing(state, user.id));
  const preview = useSelector((state) => selectRecipesPreview(state, user.id));

  const isSelf = authUser?.id && String(authUser.id) === String(user.id);
  const isPending = followPendingId === user.id;
  const recentRecipes = preview?.recipes || [];
  const recipesCount = preview?.totalItems;

  useEffect(() => {
    if (!preview) {
      dispatch(fetchUserRecipesPreview(user.id));
    }
  }, [dispatch, user.id, preview]);

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
        {recipesCount != null && (
          <p className={style.recipesCount}>Own recipes: {recipesCount}</p>
        )}

        {!isSelf && (
          <button
            type="button"
            className={style.followBtn}
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
          <use href={`${import.meta.env.BASE_URL}icons.svg#arrow-up-right1`} />
        </svg>
      </Link>
    </article>
  );
}
