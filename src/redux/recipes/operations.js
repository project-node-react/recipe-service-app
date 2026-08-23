// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const addRecipe = createAsyncThunk(
//   "recipes/addRecipe",
//   async (formData, thunkAPI) => {
//     try {
//       const response = await axios.post("/api/recipes", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

//Для тестування з токеном
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async (formData, thunkAPI) => {
    try {
      // 1. Дістаємо поточний стейт
      const state = thunkAPI.getState();
      
      // 2. Дістаємо токен (переконайся, що шлях state.auth.token правильний для вашого проєкту)
      const token = state.auth.token; 

      // 3. Відправляємо запит із токеном у заголовках
      const response = await axios.post("/api/recipes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpeDBqMm9zYnJkeXN2NWFqZ2U0eGlhcTUiLCJpYXQiOjE3ODc0OTA4MzAsImV4cCI6MTc4NzQ5MTczMH0.jGNXjFVR1iyQskTO2hCj-SmNuj2uRmsffssGhU44ahs"}`, // Додаємо токен сюди!
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);