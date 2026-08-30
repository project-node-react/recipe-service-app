import { createSlice } from "@reduxjs/toolkit";
import { logOut } from "../auth/operations";
import {
  addRecipe,
  fetchRecipes,
  fetchFavoriteIds,
  addFavoriteRecipe,
  removeFavoriteRecipe,
  addRecipeToFavorites,
  fetchFavoriteRecipes,
  fetchPopularRecipes,
  fetchRecipeById,
  removeRecipeFromFavorites,
} from "./operations";

const initialState = {
  items: [],
  page: 1,
  limit: 12,
  totalItems: 0,
  totalPages: 0,
  filters: {
    category: null,
    ingredient: null,
    area: null,
  },
  favoriteIds: [],
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
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      // будь-яка зміна фільтрів скидає пагінацію на першу сторінку
      state.page = 1;
    },
    resetRecipes() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Додавання рецепту
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
      // Список рецептів
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Улюблені (ID)
      .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
        state.favoriteIds = action.payload;
      })
      // ДОДАВАННЯ ДО УЛЮБЛЕНИХ (addFavoriteRecipe)
      .addCase(addFavoriteRecipe.pending, (state, action) => {
        state.favoriteMutationRecipeId = action.meta.arg;
        state.favoriteMutationError = null;
      })
      .addCase(addFavoriteRecipe.fulfilled, (state, action) => {
        if (!state.favoriteIds.includes(action.payload)) {
          state.favoriteIds.push(action.payload);
        }
        state.favoriteMutationRecipeId = null;
      })
      .addCase(addFavoriteRecipe.rejected, (state, action) => {
        state.favoriteMutationRecipeId = null;
        state.favoriteMutationError = action.payload;
      })

      // ВИДАЛЕННЯ З УЛЮБЛЕНИХ (removeFavoriteRecipe)
      .addCase(removeFavoriteRecipe.pending, (state, action) => {
        state.favoriteMutationRecipeId = action.meta.arg;
        state.favoriteMutationError = null;
      })
      .addCase(removeFavoriteRecipe.fulfilled, (state, action) => {
        // Видаляємо ID з масиву улюблених
        state.favoriteIds = state.favoriteIds.filter(
          (id) => id !== action.payload,
        );
        state.favoriteMutationRecipeId = null;
      })
      .addCase(removeFavoriteRecipe.rejected, (state, action) => {
        state.favoriteMutationRecipeId = null;
        state.favoriteMutationError = action.payload;
      })
      // Рецепт за ID
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
      // Популярні рецепти
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
      // Улюблені рецепти (Об'єкти/Списки)
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
      // Додавання рецепту до улюблених
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
      // Видалення рецепту з улюблених
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
      })
      .addCase(logOut.fulfilled, () => {
        return initialState;
      });
  },
});

export const { setPage, setFilters, resetRecipes } = recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
