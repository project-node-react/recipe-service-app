import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { MainTitle } from "../MainTitle/MainTitle";
import RecipeFilters from "../RecipeFilters/RecipeFilters";
import RecipeList from "../RecipeList/RecipeList";
import RecipePagination from "../RecipePagination/RecipePagination";

import {
  fetchRecipes,
  fetchFavoriteIds,
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from "../../redux/recipes/operations";
import { setFilters, setPage } from "../../redux/recipes/slice";

import {
  selectRecipes,
  selectRecipesFilters,
  selectRecipesIsLoading,
  selectRecipesError,
  selectRecipesPage,
  selectRecipesTotalPages,
  selectFavoriteIds,
} from "../../redux/recipes/selectors";

import { selectIsLoggedIn } from "../../redux/auth/selectors";
import Container from "../../components/Container/Container";
import styles from "./RecipesComponent.module.css";
import { selectCategories } from "../../redux/categories/selectors";
import SignInModal from "../../components/SignInModal/SignInModal";
import SignUpModal from "../../components/SignUpModal/SignUpModal";
import { ClipLoader } from "react-spinners";

export default function RecipesComponent() {
  const dispatch = useDispatch();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const recipes = useSelector(selectRecipes);
  const filters = useSelector(selectRecipesFilters);
  const isLoading = useSelector(selectRecipesIsLoading);
  const error = useSelector(selectRecipesError);
  const page = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const favoriteIds = useSelector(selectFavoriteIds);
  const categories = useSelector(selectCategories);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavoriteIds());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch, filters.category, filters.ingredient, filters.area, page]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  const handleToggleFavorite = (recipeId, isFavorite) => {
    if (!isLoggedIn) {
      setIsSignInOpen(true);
      return;
    }
    dispatch(
      isFavorite ? removeFavoriteRecipe(recipeId) : addFavoriteRecipe(recipeId),
    );
  };

  const handleBack = () => {
    dispatch(setFilters({ category: null }));
  };

  const handleIngredientChange = (value) => {
    dispatch(
      setFilters({
        ingredient: value || null,
      }),
    );
  };

  const handleAreaChange = (value) => {
    dispatch(
      setFilters({
        area: value || null,
      }),
    );
  };

  const handlePageChange = (nextPage) => {
    dispatch(setPage(nextPage));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const title = categories.find((cat) => cat.id === filters?.category)?.name;
  return (
    <>
      <div className={styles.page}>
        <Container>
          <button type="button" className={styles.back} onClick={handleBack}>
            <svg
              className={styles.backIcon}
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14.25 9H3.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8.25 4.5L3.75 9L8.25 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          <div className={styles.intro}>
            <MainTitle>{title}</MainTitle>

            <p className={styles.description}>
              Go on a taste journey, where every sip is a sophisticated creative
              chord, and every dessert is an expression of the most refined
              gastronomic desires.
            </p>
          </div>

          <div className={styles.content}>
            <RecipeFilters
              ingredient={filters.ingredient || ""}
              area={filters.area || ""}
              onIngredientChange={handleIngredientChange}
              onAreaChange={handleAreaChange}
            />

            <div>
              {isLoading && (
                <ClipLoader
                  color="#1976d2"
                  size={25}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}

              {!isLoading && !error && (
                <RecipeList
                  recipes={recipes}
                  favoriteIds={favoriteIds}
                  isLoggedIn={isLoggedIn}
                  onToggleFavorite={handleToggleFavorite}
                  onAuthRequired={() => setIsSignInOpen(true)}
                />
              )}

              <RecipePagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </Container>
      </div>
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
    </>
  );
}
