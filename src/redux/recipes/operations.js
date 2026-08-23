import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (params, thunkAPI) => {
    try {
      const response = await api.get("/recipes", {
        params,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (recipeId, thunkAPI) => {
    try {
      const response = await api.get(`/recipes/${recipeId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);
