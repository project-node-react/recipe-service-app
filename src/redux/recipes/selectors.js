export const selectRecipes = (state) => state.recipes.items;

export const selectRecipesFilters = (state) => state.recipes.filters;

export const selectFavoriteIds = (state) => state.recipes.favoriteIds;

export const selectRecipesIsLoading = (state) => state.recipes.isLoading;

export const selectRecipesError = (state) => state.recipes.error;
export const selectCurrentRecipe = (state) => state.recipes.currentRecipe;

export const selectRequestedRecipeId = (state) =>
  state.recipes.requestedRecipeId;

export const selectCurrentRecipeLoading = (state) =>
  state.recipes.currentRecipeLoading;

export const selectCurrentRecipeError = (state) =>
  state.recipes.currentRecipeError;

export const selectPopularRecipes = (state) => state.recipes.popularRecipes;

export const selectPopularLoading = (state) => state.recipes.popularLoading;

export const selectPopularError = (state) => state.recipes.popularError;

export const selectFavoriteRecipeIds = (state) =>
  state.recipes.favoriteRecipeIds;

export const selectFavoritesLoading = (state) => state.recipes.favoritesLoading;

export const selectFavoritesInitialized = (state) =>
  state.recipes.favoritesInitialized;

export const selectFavoritesError = (state) => state.recipes.favoritesError;

export const selectFavoriteMutationRecipeId = (state) =>
  state.recipes.favoriteMutationRecipeId;

export const selectIsRecipeFavorite = (state, recipeId) =>
  state.recipes.favoriteRecipeIds.includes(recipeId);

export const selectRecipesPage = (state) => state.recipes.page;

export const selectRecipesTotalPages = (state) => state.recipes.totalPages;

export const selectRecipesTotalItems = (state) => state.recipes.totalItems;
