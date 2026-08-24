export const selectRecipes = (state) => state.recipes.items;

export const selectRecipesFilters = (state) => state.recipes.filters;

export const selectFavoriteIds = (state) => state.recipes.favoriteIds;

export const selectRecipesIsLoading = (state) => state.recipes.isLoading;

export const selectRecipesError = (state) => state.recipes.error;

export const selectRecipesPage = (state) => state.recipes.page;

export const selectRecipesTotalPages = (state) => state.recipes.totalPages;

export const selectRecipesTotalItems = (state) => state.recipes.totalItems;
