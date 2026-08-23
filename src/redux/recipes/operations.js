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
import { http, withAuth } from "../../api/http";

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
          Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpeDBqMm9zYnJkeXN2NWFqZ2U0eGlhcTUiLCJpYXQiOjE3ODc1MDA0NzMsImV4cCI6MTc4NzUwMTM3M30.E4Bm9FNw-AsSk1lNxPucYOblJYE-gZYT98jzENugQkE"}`, // Додаємо токен сюди!
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// ─────────────────────────────────────────────────────────────
// HomePage: список рецептів + серверна пагінація + улюблені
// ─────────────────────────────────────────────────────────────

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (params = {}, thunkAPI) => {
    try {
      const { page, limit, category, ingredient, area } = {
        ...thunkAPI.getState().recipes.filters,
        page: thunkAPI.getState().recipes.page,
        limit: thunkAPI.getState().recipes.limit,
        ...params,
      };

      const response = await http.get("/api/recipes", {
        params: {
          page,
          limit,
          // бекенд не приймає порожні значення, тому віддаємо лише заповнені
          ...(category ? { category } : {}),
          ...(ingredient ? { ingredient } : {}),
          ...(area ? { area } : {}),
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

// Бекенд віддає улюблені сторінками (limit максимум 50), а для акценту на
// іконці-серці потрібні всі id, тому обходимо сторінки до кінця.
export const fetchFavoriteIds = createAsyncThunk(
  "recipes/fetchFavoriteIds",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    if (!token) return [];

    try {
      const ids = [];
      let page = 1;
      let totalPages = 1;

      do {
        const { data } = await http.get("/api/recipes/favorites", {
          params: { page, limit: 50 },
          ...withAuth(token),
        });
        ids.push(...data.data.map((recipe) => recipe.id));
        totalPages = data.totalPages || 1;
        page += 1;
      } while (page <= totalPages);

      return ids;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const addFavoriteRecipe = createAsyncThunk(
  "recipes/addFavorite",
  async (recipeId, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      await http.post(
        `/api/recipes/${recipeId}/favorite`,
        null,
        withAuth(token),
      );
      return recipeId;
    } catch (error) {
      // 409 означає, що рецепт уже в улюблених — для UI це той самий результат
      if (error.response?.status === 409) return recipeId;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const removeFavoriteRecipe = createAsyncThunk(
  "recipes/removeFavorite",
  async (recipeId, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
      await http.delete(`/api/recipes/${recipeId}/favorite`, withAuth(token));
      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);
