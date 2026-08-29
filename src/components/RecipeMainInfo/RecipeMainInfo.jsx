import styles from "./RecipeMainInfo.module.css";

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}foodicon.svg`;

const handleImageError = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === "true") {
    return;
  }

  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
};

const RecipeMainInfo = ({ recipe, onAuthorClick }) => {
  const { author, category, cookingTime, description, title } = recipe;

  return (
    <section className={styles.mainInfo} aria-labelledby="recipe-title">
      <h1 id="recipe-title" className={styles.title}>
        {title}
      </h1>

      {(category?.name || cookingTime) && (
        <div className={styles.meta}>
          {category?.name && <p className={styles.metaItem}>{category.name}</p>}
          {cookingTime && <p className={styles.metaItem}>{cookingTime} min</p>}
        </div>
      )}

      {description && <p className={styles.description}>{description}</p>}

      <button
        className={styles.authorButton}
        type="button"
        onClick={() => onAuthorClick(author.id)}
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
    </section>
  );
};

export default RecipeMainInfo;
