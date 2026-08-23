import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Налаштовуємо базовий URL вашого бекенду (зміни порт, якщо у вас інший, наприклад 3000)
axios.defaults.baseURL = "http://localhost:3000"; 

export const fetchCategories = createAsyncThunk(
  "options/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/categories");
      return response.data; // Бекенд повертає масив
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAreas = createAsyncThunk(
  "options/fetchAreas",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/areas");
      // Враховуємо специфіку ендпоінту areas (він повертає { status, data: [] })
      return response.data.data || response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchIngredients = createAsyncThunk(
  "options/fetchIngredients",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/ingredients");
      return response.data; // Бекенд повертає масив
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);