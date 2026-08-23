import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchRecipeById } from "../../redux/recipes/operations";

export default function RecipePage() {
  const { recipeId } = useParams();
  const dispatch = useDispatch();

  const { recipe, isLoading, error } = useSelector(
    (state) => state.recipes,
  );

  useEffect(() => {
    dispatch(fetchRecipeById(recipeId));
  }, [dispatch, recipeId]);

  if (isLoading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!recipe) {
    return null;
  }

  return (
    <main>
      <Link to="/recipes">← Back to recipes</Link>

      <h1>{recipe.title}</h1>

      <img
        src={recipe.thumb}
        alt={recipe.title}
        width="500"
      />

      <p>{recipe.description}</p>

      <p>
        <strong>Category:</strong> {recipe.category?.name}
      </p>

      <p>
        <strong>Area:</strong> {recipe.area?.name}
      </p>

      <p>
        <strong>Cooking time:</strong> {recipe.cookingTime} min
      </p>

      <h2>Ingredients</h2>

      <ul>
        {recipe.ingredients?.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.name} — {ingredient.measure}
          </li>
        ))}
      </ul>

      <h2>Instructions</h2>

      <p>{recipe.instructions}</p>
    </main>
  );
}
