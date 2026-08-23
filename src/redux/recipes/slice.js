import { createSlice } from "@reduxjs/toolkit";
import {
  addRecipe,
  fetchRecipes,
  fetchFavoriteIds,
  addFavoriteRecipe,
  removeFavoriteRecipe,
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
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
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
      // Улюблені
      .addCase(fetchFavoriteIds.fulfilled, (state, action) => {
        state.favoriteIds = action.payload;
      })
      .addCase(addFavoriteRecipe.fulfilled, (state, action) => {
        if (!state.favoriteIds.includes(action.payload)) {
          state.favoriteIds.push(action.payload);
        }
      })
      .addCase(removeFavoriteRecipe.fulfilled, (state, action) => {
        state.favoriteIds = state.favoriteIds.filter(
          (id) => id !== action.payload,
        );
      });
  },
});

export const { setFilters, resetRecipes } = recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
