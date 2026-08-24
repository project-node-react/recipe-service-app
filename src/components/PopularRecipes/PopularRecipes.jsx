import { Link } from "react-router-dom";
import styles from "./PopularRecipes.module.css";

const FALLBACK_IMAGE = "/foodicon.svg";

const handleImageError = (event) => {
  if (event.currentTarget.dataset.fallbackApplied === "true") {
    return;
  }

  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
};

// TODO(shared integration): Replace this local fallback with the universal
// RecipeCard as soon as that team-owned component is available.
const PopularRecipeFallback = ({ recipe }) => {
  return (
    <article className={styles.card}>
      <Link to={`/recipe/${recipe.id}`} className={styles.cardLink}>
        <div className={styles.imageWrap}>
          <img
            className={styles.image}
            src={recipe.thumb || FALLBACK_IMAGE}
            alt={recipe.thumb ? recipe.title : "Recipe image unavailable"}
            onError={handleImageError}
          />
        </div>
        <h3 className={styles.cardTitle}>{recipe.title}</h3>
        {recipe.category?.name && (
          <p className={styles.category}>{recipe.category.name}</p>
        )}
      </Link>
    </article>
  );
};

const PopularRecipes = ({ recipes, isLoading, error }) => {
  return (
    <section className={styles.section} aria-labelledby="popular-title">
      <h2 id="popular-title" className={styles.title}>
        Popular recipes
      </h2>

      {isLoading && (
        <p className={styles.status} role="status">
          Loading popular recipes...
        </p>
      )}
      {!isLoading && error && (
        <p className={styles.status} role="status">
          Popular recipes are unavailable right now.
        </p>
      )}
      {!isLoading && !error && recipes.length === 0 && (
        <p className={styles.status}>No popular recipes found.</p>
      )}
      {!isLoading && !error && recipes.length > 0 && (
        <ul className={styles.list}>
          {recipes.slice(0, 4).map((recipe) => (
            <li key={recipe.id}>
              <PopularRecipeFallback recipe={recipe} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PopularRecipes;
