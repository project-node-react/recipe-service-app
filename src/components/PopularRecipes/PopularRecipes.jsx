import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./PopularRecipes.module.css";

const PopularRecipes = ({
  recipes,
  favoriteRecipeIds,
  isLoggedIn,
  isLoading,
  error,
  onAuthRequired,
  onToggleFavorite,
}) => {
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
              <RecipeCard
                recipe={recipe}
                isFavorite={favoriteRecipeIds.includes(recipe.id)}
                isLoggedIn={isLoggedIn}
                onAuthRequired={onAuthRequired}
                onToggleFavorite={onToggleFavorite}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PopularRecipes;
