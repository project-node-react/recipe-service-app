import { createAsyncThunk } from "@reduxjs/toolkit";
import { api, getErrorMessage } from "../auth/operations";

export const fetchCategories = createAsyncThunk(
  "options/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/categories");
      return response.data; // Бекенд повертає масив
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchAreas = createAsyncThunk(
  "options/fetchAreas",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/areas");
      // Враховуємо специфіку ендпоінту areas (він повертає { status, data: [] })
      return response.data.data || response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchIngredients = createAsyncThunk(
  "options/fetchIngredients",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/ingredients");
      return response.data; // Бекенд повертає масив
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);
