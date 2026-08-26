import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserById,
} from "./operations";

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.currentUser = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.currentUser = null;
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export const usersReducer = usersSlice.reducer;
