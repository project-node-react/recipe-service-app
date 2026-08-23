import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories, fetchAreas, fetchIngredients } from "./operations";

const initialState = {
  categories: [],
  areas: [],
  ingredients: [],
  isLoading: false,
  error: null,
};

const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const optionsSlice = createSlice({
  name: "options",
  initialState,
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, handlePending)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, handleRejected)
      // Areas
      .addCase(fetchAreas.pending, handlePending)
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, handleRejected)
      // Ingredients
      .addCase(fetchIngredients.pending, handlePending)
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, handleRejected);
  },
});

export const optionsReducer = optionsSlice.reducer;