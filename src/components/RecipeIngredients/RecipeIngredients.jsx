import styles from "./RecipeIngredients.module.css";

const FALLBACK_IMAGE = "/foodicon.svg";

const handleImageError = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === "true") {
    return;
  }

  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
};

const RecipeIngredients = ({ ingredients }) => {
  return (
    <section aria-labelledby="ingredients-title">
      <h2 id="ingredients-title" className={styles.title}>
        Ingredients
      </h2>

      {ingredients.length > 0 ? (
        <ul className={styles.list}>
          {ingredients.map((ingredient) => (
            <li className={styles.item} key={ingredient.id}>
              <div className={styles.imageWrap}>
                <img
                  className={styles.image}
                  src={ingredient.image || FALLBACK_IMAGE}
                  alt={ingredient.image ? ingredient.name : ""}
                  onError={handleImageError}
                />
              </div>
              <div>
                <p className={styles.name}>{ingredient.name}</p>
                <p className={styles.measure}>{ingredient.measure}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No ingredients were provided.</p>
      )}
    </section>
  );
};

export default RecipeIngredients;
