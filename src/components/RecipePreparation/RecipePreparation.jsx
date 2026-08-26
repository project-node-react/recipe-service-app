import styles from "./RecipePreparation.module.css";

const RecipePreparation = ({
  instructions,
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

  return (
    <section aria-labelledby="preparation-title">
      <h2 id="preparation-title" className={styles.title}>
        Recipe preparation
      </h2>
      <p className={styles.instructions}>{instructions}</p>
      <button
        className={`${styles.favoriteButton} ${
          isFavorite ? styles.favoriteButtonActive : ""
        }`}
        type="button"
        disabled={isPending}
        onClick={() => onToggleFavorite()}
      >
        {buttonText}
      </button>
    </section>
  );
};

export default RecipePreparation;
