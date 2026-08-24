import { api, getErrorMessage } from "../auth/operations";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async (formData, thunkAPI) => {
    try {
      const response = await api.post("/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// //Для тестування з токеном
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { http, withAuth } from "../../api/http";

// const recipeApi = axios.create({
//   baseURL: "http://localhost:3000",
// });

// const getRequestError = (error) => ({
//   message:
//     error.response?.data?.error ||
//     error.response?.data?.message ||
//     error.message ||
//     "Request failed",
//   status: error.response?.status || null,
// });

// const getAuthConfig = (token) => ({
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });

// const getAuthToken = (thunkAPI) => thunkAPI.getState().auth.token;

// const rejectAuthenticationRequired = (thunkAPI) =>
//   thunkAPI.rejectWithValue({
//     message: "Authentication required",
//     status: 401,
//   });

// export const addRecipe = createAsyncThunk(
//   "recipes/addRecipe",
//   async (formData, thunkAPI) => {
//     try {
//       // 1. Дістаємо поточний стейт
//       const state = thunkAPI.getState();

//       // 2. Дістаємо токен (переконайся, що шлях state.auth.token правильний для вашого проєкту)
//       const token = state.auth.token;

//       // 3. Відправляємо запит із токеном у заголовках
//       const response = await axios.post("/api/recipes", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   },
// );
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

      const response = await api.get("/recipes", {
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
    try {
      const ids = [];
      let page = 1;
      let totalPages = 1;

      do {
        const { data } = await api.get("/recipes/favorites", {
          params: { page, limit: 50 },
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
    try {
      await api.post(`/recipes/${recipeId}/favorite`, null);
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
    try {
      await api.delete(`/recipes/${recipeId}/favorite`);
      return recipeId;
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
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (recipeId, { getState }) => {
      const recipes = getState().recipes;

      return !(
        recipes.currentRecipeLoading && recipes.requestedRecipeId === recipeId
      );
    },
  },
);

export const fetchPopularRecipes = createAsyncThunk(
  "recipes/fetchPopularRecipes",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/recipes/popular", {
        params: { limit: 4 },
      });

      return Array.isArray(response.data) ? response.data.slice(0, 4) : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => !getState().recipes.popularLoading,
  },
);

export const fetchFavoriteRecipes = createAsyncThunk(
  "recipes/fetchFavoriteRecipes",
  async (_, thunkAPI) => {
    try {
      const firstResponse = await api.get("/recipes/favorites", {
        params: { page: 1, limit: 50 },
      });
      const firstPage = firstResponse.data;
      const recipes = Array.isArray(firstPage.data) ? [...firstPage.data] : [];
      const totalPages = Number(firstPage.totalPages) || 1;

      for (let page = 2; page <= totalPages; page += 1) {
        const response = await api.get("/recipes/favorites", {
          params: { page, limit: 50 },
        });

        if (Array.isArray(response.data?.data)) {
          recipes.push(...response.data.data);
        }
      }

      return [...new Set(recipes.map((recipe) => recipe.id).filter(Boolean))];
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => !getState().recipes.favoritesLoading,
  },
);

export const addRecipeToFavorites = createAsyncThunk(
  "recipes/addRecipeToFavorites",
  async (recipeId, thunkAPI) => {
    try {
      await api.post(`/recipes/${recipeId}/favorite`, undefined);
      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
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
    try {
      await api.delete(`/recipes/${recipeId}/favorite`);
      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().recipes.favoriteMutationRecipeId === null,
  },
);
