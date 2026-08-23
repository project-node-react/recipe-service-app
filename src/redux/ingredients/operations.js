import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

export const fetchIngredients = createAsyncThunk(
  "ingredients/fetchIngredients",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/ingredients");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);