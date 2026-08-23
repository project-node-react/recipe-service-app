export const selectRecipes = (state) => state.recipes.items;

export const selectRecipesFilters = (state) => state.recipes.filters;

export const selectFavoriteIds = (state) => state.recipes.favoriteIds;

export const selectRecipesIsLoading = (state) => state.recipes.isLoading;

export const selectRecipesError = (state) => state.recipes.error;
