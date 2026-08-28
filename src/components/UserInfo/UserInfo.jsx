import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import defaultAvatar from "../../assets/profile.png";
import { followUser, unfollowUser, updateAvatar } from "../../redux/users/operations";
import {
  selectFollowPendingId,
  selectIsFollowing,
  selectAvatarUploading,
} from "../../redux/users/selectors";
import style from "./UserInfo.module.css";

export default function UserInfo({ user, isOwnPage, onLogOutClick }) {
  const dispatch = useDispatch();

  const followPendingId = useSelector(selectFollowPendingId);
  const isFollowing = useSelector((state) => selectIsFollowing(state, user?.id));
  const avatarUploading = useSelector(selectAvatarUploading);

  if (!user) return null;

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;

    dispatch(updateAvatar(file))
      .unwrap()
      .catch((error) => toast.error(error || "Failed to update avatar"));
  };

  const handleFollowClick = () => {
    const action = isFollowing ? unfollowUser(user.id) : followUser(user.id);

    dispatch(action)
      .unwrap()
      .catch((error) => toast.error(error || "Something went wrong"));
  };

  const isFollowPending = followPendingId === user.id;

  return (
    <div className={style.wrapper}>
      <div className={style.card}>
        <div className={style.avatarWrap}>
        <img
          className={style.avatar}
          src={user.avatar || defaultAvatar}
          alt={user.name || "User avatar"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = defaultAvatar;
          }}
        />

        {isOwnPage && (
          <label className={style.avatarUpload} aria-label="Change avatar">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
            <svg className={style.avatarUploadIcon} aria-hidden="true">
              <use href={`${import.meta.env.BASE_URL}icons.svg#plus`} />
            </svg>
          </label>
        )}
        </div>

        <p className={style.name}>{user.name}</p>

        <dl className={style.stats}>
          <div className={style.statRow}>
            <dt>Email:</dt>
            <dd className={style.statValueEmail}>{user.email}</dd>
          </div>
          <div className={style.statRow}>
            <dt>Added recipes:</dt>
            <dd>{user.recipesCount ?? 0}</dd>
          </div>
          {isOwnPage && (
            <div className={style.statRow}>
              <dt>Favorites:</dt>
              <dd>{user.favoritesCount ?? 0}</dd>
            </div>
          )}
          <div className={style.statRow}>
            <dt>Followers:</dt>
            <dd>{user.followersCount ?? 0}</dd>
          </div>
          {isOwnPage && (
            <div className={style.statRow}>
              <dt>Following:</dt>
              <dd>{user.followingCount ?? 0}</dd>
            </div>
          )}
        </dl>
      </div>

      {isOwnPage ? (
        <button type="button" className={style.actionBtn} onClick={onLogOutClick}>
          Log out
        </button>
      ) : (
        <button
          type="button"
          className={style.followActionBtn}
          onClick={handleFollowClick}
          disabled={isFollowPending}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
}
