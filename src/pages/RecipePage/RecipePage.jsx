import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import Container from "../../components/Container/Container";
import { PathInfo } from "../../components/PathInfo/PathInfo";
import PopularRecipes from "../../components/PopularRecipes/PopularRecipes";
import RecipeInfo from "../../components/RecipeInfo/RecipeInfo";
import SignInModal from "../../components/SignInModal/SignInModal";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import {
  addRecipeToFavorites,
  fetchFavoriteRecipes,
  fetchPopularRecipes,
  fetchRecipeById,
  removeRecipeFromFavorites,
} from "../../redux/recipes/operations";
import {
  selectCurrentRecipe,
  selectCurrentRecipeError,
  selectCurrentRecipeLoading,
  selectFavoriteMutationRecipeId,
  selectFavoriteRecipeIds,
  selectFavoritesError,
  selectFavoritesInitialized,
  selectFavoritesLoading,
  selectIsRecipeFavorite,
  selectPopularError,
  selectPopularLoading,
  selectPopularRecipes,
  selectRequestedRecipeId,
} from "../../redux/recipes/selectors";
import styles from "./RecipePage.module.css";
import SignUpModal from "../../components/SignUpModal/SignUpModal";

const RecipePage = () => {
  const { id: recipeId } = useParams();
  const dispatch = useDispatch();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const recipe = useSelector(selectCurrentRecipe);
  const requestedRecipeId = useSelector(selectRequestedRecipeId);
  const recipeLoading = useSelector(selectCurrentRecipeLoading);
  const recipeError = useSelector(selectCurrentRecipeError);
  const popularRecipes = useSelector(selectPopularRecipes);
  const popularLoading = useSelector(selectPopularLoading);
  const popularError = useSelector(selectPopularError);
  const favoritesLoading = useSelector(selectFavoritesLoading);
  const favoritesInitialized = useSelector(selectFavoritesInitialized);
  const favoritesError = useSelector(selectFavoritesError);
  const favoriteMutationRecipeId = useSelector(selectFavoriteMutationRecipeId);
  const favoriteRecipeIds = useSelector(selectFavoriteRecipeIds);
  const isFavorite = useSelector((state) =>
    selectIsRecipeFavorite(state, recipeId),
  );

  useEffect(() => {
    if (!recipeId?.trim()) {
      return;
    }

    dispatch(fetchRecipeById(recipeId));
  }, [dispatch, recipeId]);

  useEffect(() => {
    dispatch(fetchPopularRecipes());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavoriteRecipes());
    }
  }, [dispatch, isLoggedIn]);

  const handleToggleFavorite = async (
    targetRecipeId = recipeId,
    targetIsFavorite = isFavorite,
  ) => {
    if (!isLoggedIn) {
      setIsSignInOpen(true);
      return;
    }

    if (!targetRecipeId || favoriteMutationRecipeId) {
      return;
    }

    const action = targetIsFavorite
      ? removeRecipeFromFavorites(targetRecipeId)
      : addRecipeToFavorites(targetRecipeId);

    try {
      await dispatch(action).unwrap();
      toast.success(
        targetIsFavorite
          ? "Recipe removed from favorites"
          : "Recipe added to favorites",
      );
    } catch (error) {
      if (error?.name === "ConditionError") {
        return;
      }

      toast.error(error?.message || "Unable to update favorites");
    }
  };

  const handleAuthorClick = () => {
    if (!isLoggedIn) {
      setIsSignInOpen(true);
      return;
    }

    // TODO(shared integration): Navigate to the author's UserPage once its
    // public route is confirmed by the owning team member.
  };

  const isMissingId = !recipeId?.trim();
  const isCurrentRequest = requestedRecipeId === recipeId;
  const activeRecipeError = isCurrentRequest ? recipeError : null;
  const isNotFound = isMissingId || activeRecipeError?.status === 404;
  const isCurrentRecipe = recipe?.id === recipeId;
  const showInitialLoader =
    !isMissingId &&
    (!isCurrentRequest ||
      recipeLoading ||
      (!isCurrentRecipe && !activeRecipeError));

  return (
    <div className={styles.page}>
      <Container>
        {showInitialLoader && (
          <div className={styles.loader} role="status">
            <ClipLoader color="#050505" size={64} aria-label="Loading recipe" />
          </div>
        )}

        {!showInitialLoader && isNotFound && (
          <section className={styles.message}>
            <h1>Recipe not found</h1>
            <p>
              The requested recipe does not exist or is no longer available.
            </p>
            <Link className={styles.homeLink} to="/">
              Back to home
            </Link>
          </section>
        )}

        {!showInitialLoader && activeRecipeError && !isNotFound && (
          <section className={styles.message}>
            <h1>Unable to load recipe</h1>
            <p>{activeRecipeError.message || "Please try again later."}</p>
            <button
              className={styles.retryButton}
              type="button"
              onClick={() => dispatch(fetchRecipeById(recipeId))}
            >
              Try again
            </button>
          </section>
        )}

        {!showInitialLoader && !activeRecipeError && isCurrentRecipe && (
          <>
            <div className={styles.pathInfo}>
              <PathInfo currentPage={recipe.title} />
            </div>

            <RecipeInfo
              recipe={recipe}
              isAuthenticated={isLoggedIn}
              isFavoriteAvailable={!favoritesError}
              isFavorite={isLoggedIn && isFavorite}
              isFavoritePending={
                (isLoggedIn && !favoritesInitialized) ||
                favoritesLoading ||
                favoriteMutationRecipeId === recipeId
              }
              onAuthorClick={handleAuthorClick}
              onToggleFavorite={handleToggleFavorite}
            />

            <PopularRecipes
              recipes={popularRecipes}
              favoriteRecipeIds={favoriteRecipeIds}
              isLoggedIn={Boolean(isLoggedIn)}
              isLoading={popularLoading}
              error={popularError}
              onAuthRequired={() => setIsSignInOpen(true)}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}
      </Container>
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
    </div>
  );
};

export default RecipePage;
