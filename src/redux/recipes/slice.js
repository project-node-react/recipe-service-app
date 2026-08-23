import { createSlice } from "@reduxjs/toolkit";
import {
  addRecipe,
  addRecipeToFavorites,
  fetchFavoriteRecipes,
  fetchPopularRecipes,
  fetchRecipeById,
  removeRecipeFromFavorites,
} from "./operations";

const initialState = {
  isLoading: false,
  error: null,
  currentRecipe: null,
  requestedRecipeId: null,
  currentRecipeLoading: false,
  currentRecipeError: null,
  popularRecipes: [],
  popularLoading: false,
  popularError: null,
  favoriteRecipeIds: [],
  favoritesLoading: false,
  favoritesInitialized: false,
  favoritesError: null,
  favoriteMutationRecipeId: null,
  favoriteMutationError: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addRecipe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRecipe.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addRecipe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecipeById.pending, (state, action) => {
        state.currentRecipe = null;
        state.requestedRecipeId = action.meta.arg;
        state.currentRecipeLoading = true;
        state.currentRecipeError = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        if (state.requestedRecipeId !== action.meta.arg) {
          return;
        }

        state.currentRecipe = action.payload;
        state.currentRecipeLoading = false;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        if (state.requestedRecipeId !== action.meta.arg) {
          return;
        }

        state.currentRecipeLoading = false;
        state.currentRecipeError = action.payload;
      })
      .addCase(fetchPopularRecipes.pending, (state) => {
        state.popularLoading = true;
        state.popularError = null;
      })
      .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
        state.popularRecipes = action.payload;
        state.popularLoading = false;
      })
      .addCase(fetchPopularRecipes.rejected, (state, action) => {
        state.popularLoading = false;
        state.popularError = action.payload;
      })
      .addCase(fetchFavoriteRecipes.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesInitialized = false;
        state.favoritesError = null;
      })
      .addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
        state.favoriteRecipeIds = action.payload;
        state.favoritesLoading = false;
        state.favoritesInitialized = true;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesInitialized = true;
        state.favoritesError = action.payload;
      })
      .addCase(addRecipeToFavorites.pending, (state, action) => {
        state.favoriteMutationRecipeId = action.meta.arg;
        state.favoriteMutationError = null;
      })
      .addCase(addRecipeToFavorites.fulfilled, (state, action) => {
        if (!state.favoriteRecipeIds.includes(action.payload)) {
          state.favoriteRecipeIds.push(action.payload);
        }
        state.favoriteMutationRecipeId = null;
      })
      .addCase(addRecipeToFavorites.rejected, (state, action) => {
        state.favoriteMutationRecipeId = null;
        state.favoriteMutationError = action.payload;
      })
      .addCase(removeRecipeFromFavorites.pending, (state, action) => {
        state.favoriteMutationRecipeId = action.meta.arg;
        state.favoriteMutationError = null;
      })
      .addCase(removeRecipeFromFavorites.fulfilled, (state, action) => {
        state.favoriteRecipeIds = state.favoriteRecipeIds.filter(
          (recipeId) => recipeId !== action.payload,
        );
        state.favoriteMutationRecipeId = null;
      })
      .addCase(removeRecipeFromFavorites.rejected, (state, action) => {
        state.favoriteMutationRecipeId = null;
        state.favoriteMutationError = action.payload;
      });
  },
});

export const recipesReducer = recipesSlice.reducer;
