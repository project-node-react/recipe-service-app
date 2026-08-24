import styles from "./RecipePreparation.module.css";

const RecipePreparation = ({
  instructions,
  isAuthenticated,
  isFavoriteAvailable,
  isFavorite,
  isPending,
  onToggleFavorite,
}) => {
  let buttonText = isFavorite
    ? "Remove from favorites"
    : "Add to favorites";

  if (isPending) {
    buttonText = "Updating...";
  }

  if (!isFavoriteAvailable && isAuthenticated) {
    buttonText = "Favorites unavailable";
  }

  return (
    <section aria-labelledby="preparation-title">
      <h2 id="preparation-title" className={styles.title}>
        Preparation
      </h2>
      <p className={styles.instructions}>{instructions}</p>
      <button
        className={styles.favoriteButton}
        type="button"
        disabled={!isAuthenticated || !isFavoriteAvailable || isPending}
        onClick={onToggleFavorite}
      >
        {buttonText}
      </button>
    </section>
  );
};

export default RecipePreparation;
