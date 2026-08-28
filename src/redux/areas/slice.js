import { createSlice } from "@reduxjs/toolkit";
import { fetchAreas } from "./operations";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const areasSlice = createSlice({
  name: "areas",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const areasReducer = areasSlice.reducer;