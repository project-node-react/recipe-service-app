import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

import Container from "../../components/Container/Container";
import RecipeList from "../../components/RecipeList/RecipeList";
import RecipePagination from "../../components/RecipePagination/RecipePagination";
import SignInModal from "../../components/SignInModal/SignInModal";

import {
  fetchRecipes,
  fetchFavoriteIds,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../../redux/recipes/operations";
import { setPage } from "../../redux/recipes/slice";
import {
  selectRecipes,
  selectRecipesPage,
  selectRecipesTotalPages,
  selectRecipesFilters,
  selectFavoriteIds,
  selectRecipesIsLoading,
} from "../../redux/recipes/selectors";
import { selectIsLoggedIn } from "../../redux/auth/selectors";

import style from "./HomePage.module.css";
import SignUpModal from "../../components/SignUpModal/SignUpModal";

import { Hero } from "../../components/Hero/Hero";

export default function HomePage() {
  const dispatch = useDispatch();

  const recipes = useSelector(selectRecipes);
  const page = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);
  const filters = useSelector(selectRecipesFilters);
  const favoriteIds = useSelector(selectFavoriteIds);
  const isLoading = useSelector(selectRecipesIsLoading);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Кожна зміна сторінки або фільтрів — це новий запит на бекенд:
  // пагінація серверна, а не нарізка вже завантаженого масиву.
  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch, page, filters]);

  // Список улюблених потрібен, щоб іконка-серце мала стилі акценту.
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavoriteIds());
    }
  }, [dispatch, isLoggedIn]);

  const handlePageChange = useCallback(
    (nextPage) => {
      dispatch(setPage(nextPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch],
  );

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
      <Hero />
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
          <>
            <RecipeList
              recipes={recipes}
              favoriteIds={favoriteIds}
              isLoggedIn={isLoggedIn}
              onToggleFavorite={handleToggleFavorite}
              onAuthRequired={handleAuthRequired}
            />

            <RecipePagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onCreateAccount={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSignInAccount={() => {
          setIsSignInOpen(true);
          setIsSignUpOpen(false);
        }}
      />
    </Container>
  );
}
