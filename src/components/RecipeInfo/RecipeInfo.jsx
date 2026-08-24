import RecipeIngredients from "../RecipeIngredients/RecipeIngredients";
import RecipeMainInfo from "../RecipeMainInfo/RecipeMainInfo";
import RecipePreparation from "../RecipePreparation/RecipePreparation";
import styles from "./RecipeInfo.module.css";

const RecipeInfo = ({
  recipe,
  isAuthenticated,
  isFavoriteAvailable,
  isFavorite,
  isFavoritePending,
  onAuthorClick,
  onToggleFavorite,
}) => {
  return (
    <article className={styles.recipeInfo}>
      <RecipeMainInfo recipe={recipe} onAuthorClick={onAuthorClick} />
      <RecipeIngredients ingredients={recipe.ingredients} />
      <RecipePreparation
        instructions={recipe.instructions}
        isAuthenticated={isAuthenticated}
        isFavoriteAvailable={isFavoriteAvailable}
        isFavorite={isFavorite}
        isPending={isFavoritePending}
        onToggleFavorite={onToggleFavorite}
      />
    </article>
  );
};

export default RecipeInfo;
