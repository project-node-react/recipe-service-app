import { createSlice } from "@reduxjs/toolkit";
import { addRecipe } from "./operations";

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    isLoading: false,
    error: null,
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
      });
  },
});

export const recipesReducer = recipesSlice.reducer;