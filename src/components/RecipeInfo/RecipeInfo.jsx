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
      <div className={styles.ingredients}>
        <RecipeIngredients ingredients={recipe.ingredients} />
      </div>
      <div className={styles.preparation}>
        <RecipePreparation
          instructions={recipe.instructions}
          isAuthenticated={isAuthenticated}
          isFavoriteAvailable={isFavoriteAvailable}
          isFavorite={isFavorite}
          isPending={isFavoritePending}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </article>
  );
};

export default RecipeInfo;
