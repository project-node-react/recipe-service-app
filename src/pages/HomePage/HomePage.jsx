import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

import Container from "../../components/Container/Container";
import RecipeList from "../../components/RecipeList/RecipeList";
import SignInModal from "../../components/SignInModal/SignInModal";

import {
  fetchRecipes,
  fetchFavoriteIds,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../../redux/recipes/operations";
import {
  selectRecipes,
  selectRecipesFilters,
  selectFavoriteIds,
  selectRecipesIsLoading,
} from "../../redux/recipes/selectors";
import { selectIsLoggedIn } from "../../redux/auth/selectors";

import style from "./HomePage.module.css";

export default function HomePage() {
  const dispatch = useDispatch();

  const recipes = useSelector(selectRecipes);
  const filters = useSelector(selectRecipesFilters);
  const favoriteIds = useSelector(selectFavoriteIds);
  const isLoading = useSelector(selectRecipesIsLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [isSignInOpen, setIsSignInOpen] = useState(false);

  // Зміна фільтрів — це новий запит на бекенд.
  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch, filters]);

  // Список улюблених потрібен, щоб іконка-серце мала стилі акценту.
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavoriteIds());
    }
  }, [dispatch, isLoggedIn]);

  const handleToggleFavorite = useCallback(
    (recipeId, isFavorite) => {
      dispatch(
        isFavorite
          ? removeFavoriteRecipe(recipeId)
          : addFavoriteRecipe(recipeId),
      );
    },
    [dispatch],
  );

  const handleAuthRequired = useCallback(() => setIsSignInOpen(true), []);

  return (
    <Container>
      <section className={style.section}>
        <h2 className={style.title}>Recipes</h2>

        {isLoading ? (
          <div className={style.loader}>
            <ClipLoader
              color="#e44848"
              size={60}
              aria-label="Loading recipes"
            />
          </div>
        ) : (
          <RecipeList
            recipes={recipes}
            favoriteIds={favoriteIds}
            isLoggedIn={isLoggedIn}
            onToggleFavorite={handleToggleFavorite}
            onAuthRequired={handleAuthRequired}
          />
        )}
      </section>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onCreateAccount={() => setIsSignInOpen(false)}
      />
    </Container>
  );
}
