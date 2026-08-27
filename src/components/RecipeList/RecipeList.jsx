import RecipeCard from "../RecipeCard/RecipeCard";
import style from "./RecipeList.module.css";

export default function RecipeList({
  recipes,
  favoriteIds = [],
  isLoggedIn = false,
  onToggleFavorite,
  onAuthRequired,
}) {
  console.log(
    "AUTHORS FROM DB:",
    recipes.map((recipe) => ({
      title: recipe.title,
      owner: recipe.owner,
    })),
  );

  if (!recipes.length) {
    return <p className={style.empty}>No recipes found. Try other filters.</p>;
  }

  return (
    <ul className={style.list}>
      {recipes.map((recipe) => (
        <li className={style.item} key={recipe.id}>
          <RecipeCard
            recipe={recipe}
            isFavorite={favoriteIds.includes(recipe.id)}
            isLoggedIn={isLoggedIn}
            onToggleFavorite={onToggleFavorite}
            onAuthRequired={onAuthRequired}
          />
        </li>
      ))}
    </ul>
  );
}
