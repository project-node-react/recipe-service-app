import RecipeIngredients from "../RecipeIngredients/RecipeIngredients";
import RecipeImage from "../RecipeImage/RecipeImage";
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
      <RecipeImage image={recipe.image} title={recipe.title} />
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
