import styles from "./RecipeMainInfo.module.css";

const FALLBACK_IMAGE = "/foodicon.svg";

const handleImageError = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === "true") {
    return;
  }

  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
};

const RecipeMainInfo = ({ recipe, onAuthorClick }) => {
  const { author, category, cookingTime, description, image, title } = recipe;

  return (
    <section className={styles.mainInfo} aria-labelledby="recipe-title">
      <div className={styles.imageWrap}>
        <img
          className={styles.recipeImage}
          src={image || FALLBACK_IMAGE}
          alt={image ? title : "Recipe image unavailable"}
          onError={handleImageError}
        />
      </div>

      <div className={styles.details}>
        <h1 id="recipe-title" className={styles.title}>
          {title}
        </h1>

        {(category?.name || cookingTime) && (
          <div className={styles.meta}>
            {category?.name && (
              <p className={styles.metaItem}>{category.name}</p>
            )}
            {cookingTime && (
              <p className={styles.metaItem}>{cookingTime} min</p>
            )}
          </div>
        )}

        {description && <p className={styles.description}>{description}</p>}

        <button
          className={styles.authorButton}
          type="button"
          onClick={onAuthorClick}
        >
          <img
            className={styles.authorAvatar}
            src={author.avatar || FALLBACK_IMAGE}
            alt=""
            onError={handleImageError}
          />
          <span className={styles.authorText}>
            <span className={styles.authorLabel}>Created by:</span>
            <span className={styles.authorName}>{author.name}</span>
          </span>
        </button>
      </div>
    </section>
  );
};

export default RecipeMainInfo;
