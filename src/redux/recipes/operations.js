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

const recipeApi = axios.create({
  baseURL: "http://localhost:3000",
});

const getRequestError = (error) => ({
  message:
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message ||
    "Request failed",
  status: error.response?.status || null,
});

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getAuthToken = (thunkAPI) => thunkAPI.getState().auth.token;

const rejectAuthenticationRequired = (thunkAPI) =>
  thunkAPI.rejectWithValue({
    message: "Authentication required",
    status: 401,
  });

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

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (recipeId, thunkAPI) => {
    try {
      const response = await recipeApi.get(`/api/recipes/${recipeId}`);
      const recipe = response.data;

      return {
        ...recipe,
        description: recipe.description || "",
        image: recipe.thumb || recipe.preview || null,
        author: {
          id: recipe.owner?.id || null,
          name: recipe.owner?.name || "Unknown author",
          avatar: recipe.owner?.avatar || null,
        },
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients.map((ingredient) => ({
              id: ingredient.id,
              name: ingredient.name,
              image: ingredient.img || null,
              measure: ingredient.measure,
            }))
          : [],
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(getRequestError(error));
    }
  },
  {
    condition: (recipeId, { getState }) => {
      const recipes = getState().recipes;

      return !(
        recipes.currentRecipeLoading &&
        recipes.requestedRecipeId === recipeId
      );
    },
  },
);

export const fetchPopularRecipes = createAsyncThunk(
  "recipes/fetchPopularRecipes",
  async (_, thunkAPI) => {
    try {
      const response = await recipeApi.get("/api/recipes/popular", {
        params: { limit: 4 },
      });

      return Array.isArray(response.data) ? response.data.slice(0, 4) : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(getRequestError(error));
    }
  },
  {
    condition: (_, { getState }) => !getState().recipes.popularLoading,
  },
);

export const fetchFavoriteRecipes = createAsyncThunk(
  "recipes/fetchFavoriteRecipes",
  async (_, thunkAPI) => {
    const token = getAuthToken(thunkAPI);

    if (!token) {
      return rejectAuthenticationRequired(thunkAPI);
    }

    try {
      const firstResponse = await recipeApi.get("/api/recipes/favorites", {
        ...getAuthConfig(token),
        params: { page: 1, limit: 50 },
      });
      const firstPage = firstResponse.data;
      const recipes = Array.isArray(firstPage.data) ? [...firstPage.data] : [];
      const totalPages = Number(firstPage.totalPages) || 1;

      for (let page = 2; page <= totalPages; page += 1) {
        const response = await recipeApi.get("/api/recipes/favorites", {
          ...getAuthConfig(token),
          params: { page, limit: 50 },
        });

        if (Array.isArray(response.data?.data)) {
          recipes.push(...response.data.data);
        }
      }

      return [...new Set(recipes.map((recipe) => recipe.id).filter(Boolean))];
    } catch (error) {
      return thunkAPI.rejectWithValue(getRequestError(error));
    }
  },
  {
    condition: (_, { getState }) => !getState().recipes.favoritesLoading,
  },
);

export const addRecipeToFavorites = createAsyncThunk(
  "recipes/addRecipeToFavorites",
  async (recipeId, thunkAPI) => {
    const token = getAuthToken(thunkAPI);

    if (!token) {
      return rejectAuthenticationRequired(thunkAPI);
    }

    try {
      await recipeApi.post(
        `/api/recipes/${recipeId}/favorite`,
        undefined,
        getAuthConfig(token),
      );
      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(getRequestError(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().recipes.favoriteMutationRecipeId === null,
  },
);

export const removeRecipeFromFavorites = createAsyncThunk(
  "recipes/removeRecipeFromFavorites",
  async (recipeId, thunkAPI) => {
    const token = getAuthToken(thunkAPI);

    if (!token) {
      return rejectAuthenticationRequired(thunkAPI);
    }

    try {
      await recipeApi.delete(
        `/api/recipes/${recipeId}/favorite`,
        getAuthConfig(token),
      );
      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(getRequestError(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().recipes.favoriteMutationRecipeId === null,
  },
);
