import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import style from "./RecipeCard.module.css";

// Універсальна картка рецепта: використовується у RecipeList на HomePage,
// а також придатна для сторінок з улюбленими та власними рецептами.
export default function RecipeCard({
  recipe,
  isFavorite = false,
  isLoggedIn = false,
  onToggleFavorite,
  onAuthRequired,
}) {
  const navigate = useNavigate();
  const { id, title, description, thumb, owner } = recipe;

  const handleAuthorClick = () => {
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    navigate(`/user/${owner.id}`);
  };

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    onToggleFavorite?.(id, isFavorite);
  };

  return (
    <article className={style.card}>
      <img
        className={style.image}
        src={thumb || "/foodicon.svg"}
        alt={title}
        loading="lazy"
      />

      <div className={style.section}>
        <div className={style.text}>
          <h3 className={style.title}>{title}</h3>
          {description ? (
            <p className={style.description}>{description}</p>
          ) : null}
        </div>

        <div className={style.footer}>
          <button
            type="button"
            className={style.author}
            onClick={handleAuthorClick}
            aria-label={`Author ${owner.name}`}
          >
            <span className={style.avatarWrap}>
              {owner.avatar ? (
                <img className={style.avatar} src={owner.avatar} alt="" />
              ) : (
                <span className={style.avatarFallback} aria-hidden="true">
                  {owner.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </span>
            <span className={style.authorName}>{owner.name}</span>
          </button>

          <div className={style.actions}>
            <button
              type="button"
              className={clsx(style.action, isFavorite && style.actionActive)}
              onClick={handleFavoriteClick}
              aria-pressed={isFavorite}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <svg className={style.icon} aria-hidden="true">
                <use href="/icons.svg#heart" />
              </svg>
            </button>

            <button
              type="button"
              className={style.action}
              onClick={() => navigate(`/recipe/${id}`)}
              aria-label={`Open recipe ${title}`}
            >
              <svg className={style.icon} aria-hidden="true">
                <use href="/icons.svg#arrow-up-right" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
