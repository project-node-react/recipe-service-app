import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Container from "../../components/Container/Container";
import { MainTitle } from "../../components/MainTitle/MainTitle";
import RecipeFilters from "../../components/RecipeFilters/RecipeFilters";
import RecipeList from "../../components/RecipeList/RecipeList";
import RecipePagination from "../../components/RecipePagination/RecipePagination";

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

import { selectCategories } from "../../redux/categories/selectors";
import { selectIsLoggedIn } from "../../redux/auth/selectors";

import styles from "./RecipesPage.module.css";

export default function RecipesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId } = useParams();

  const recipes = useSelector(selectRecipes);
  const filters = useSelector(selectRecipesFilters);
  const isLoading = useSelector(selectRecipesIsLoading);
  const error = useSelector(selectRecipesError);
  const page = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);
  const categories = useSelector(selectCategories);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const favoriteIds = useSelector(selectFavoriteIds);

  console.log("❤️ RECIPES PAGE FAVORITE IDS:", favoriteIds);

  console.log("❤️ RECIPES PAGE FAVORITE IDS:", favoriteIds);

  const selectedCategory = categories.find(
    (category) => String(category.id) === String(categoryId),
  );

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavoriteIds());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    dispatch(
      setFilters({
        category: categoryId || null,
      }),
    );

    dispatch(setPage(1));
  }, [dispatch, categoryId]);

  useEffect(() => {
    dispatch(
      fetchRecipes({
        page,
        limit: 12,
        category: categoryId || undefined,
        ingredient: filters.ingredient || undefined,
        area: filters.area || undefined,
      }),
    );
  }, [
    dispatch,
    categoryId,
    filters.ingredient,
    filters.area,
    page,
  ]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  const handleToggleFavorite = (recipeId, isFavorite) => {
    dispatch(
      isFavorite
        ? removeFavoriteRecipe(recipeId)
        : addFavoriteRecipe(recipeId),
    );
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleIngredientChange = (value) => {
    dispatch(
      setFilters({
        ingredient: value || null,
      }),
    );

    dispatch(setPage(1));
  };

  const handleAreaChange = (value) => {
    dispatch(
      setFilters({
        area: value || null,
      }),
    );

    dispatch(setPage(1));
  };

  const handlePageChange = (nextPage) => {
    dispatch(setPage(nextPage));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const title =
    selectedCategory?.name === "Dessert"
      ? "Desserts"
      : selectedCategory?.name || "All categories";

  return (
    <Container>
      <div className={styles.page}>
        <button
          type="button"
          className={styles.back}
          onClick={handleBack}
        >
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
            Go on a taste journey, where every sip is a sophisticated
            creative chord, and every dessert is an expression of the most
            refined gastronomic desires.
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
            {isLoading && <p>Loading recipes...</p>}

            {!isLoading && !error && (
              <RecipeList
                recipes={recipes}
                favoriteIds={favoriteIds}
                isLoggedIn={isLoggedIn}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            <RecipePagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
