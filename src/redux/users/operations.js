import { api, getErrorMessage } from "../auth/operations";
import { createAsyncThunk } from "@reduxjs/toolkit";

/*
 * GET @ /users/:id
 * Профіль будь-якого користувача за id. Бекенд віддає ТІЛЬКИ
 * { id, name, email, avatar, recipesCount, followersCount } —
 * без favoritesCount/followingCount (це приватні лічильники, їх бекенд
 * не показує для чужого профілю). Використовувати для перегляду ЧУЖОГО
 * профілю (isOwnPage === false).
 */
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * GET @ /users/current
 * Профіль АВТОРИЗОВАНОГО користувача — тут вже є всі 4 лічильники
 * (recipesCount, favoritesCount, followersCount, followingCount).
 * Використовувати для перегляду СВОГО профілю (isOwnPage === true) —
 * саме тому UserInfo не може завжди ходити через fetchUserById.
 */
export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/current");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * GET @ /recipes/own?page&limit
 * УВАГА: цей маршрут завжди повертає рецепти АВТОРИЗОВАНОГО користувача,
 * userId він не приймає. Для вкладки "recipes" на чужому профілі окремого
 * маршруту поки не підтверджено — питання команді бекенду разом із
 * пагінацією followers/following (див. fetchFollowers/fetchFollowing нижче).
 */
export const fetchUserRecipes = createAsyncThunk(
  "users/fetchUserRecipes",
  async ({ page = 1, limit = 12 } = {}, thunkAPI) => {
    try {
      const response = await api.get("/recipes/own", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * GET @ /recipes/favorites?page&limit
 * Та сама форма відповіді, що й /recipes/own. Пагінація вже серверна.
 */
export const fetchUserFavorites = createAsyncThunk(
  "users/fetchUserFavorites",
  async ({ page = 1, limit = 12 } = {}, thunkAPI) => {
    try {
      const response = await api.get("/recipes/favorites", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * DELETE @ /recipes/:id — видалення власного рецепта (кошик на вкладці
 * My recipes). НЕ плутати з видаленням з улюблених — для My favorites
 * використовується вже готовий removeFavoriteRecipe з redux/recipes.
 */
export const deleteOwnRecipe = createAsyncThunk(
  "users/deleteOwnRecipe",
  async (recipeId, thunkAPI) => {
    try {
      await api.delete(`/recipes/${recipeId}`);
      return recipeId;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * GET @ /users/:id/followers
 * Бекенд поки НЕ пагінує (немає page/limit у параметрах) — повертає
 * весь список одразу, { followers: [...] }. За домовленістю з
 * командою — на фронті теж поки без пагінації для цього табу,
 * дочекаємось серверної пагінації від бекенду.
 */
export const fetchFollowers = createAsyncThunk(
  "users/fetchFollowers",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/users/${userId}/followers`);
      return response.data.followers || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * GET @ /users/following
 * Завжди "мої" підписки — маршрут не приймає userId, тому доступний
 * лише коли isOwnPage === true (TabsList це вже враховує). Без
 * пагінації — та сама домовленість, що й для followers.
 */
export const fetchFollowing = createAsyncThunk(
  "users/fetchFollowing",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/following");
      return response.data.following || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * POST @ /users/:id/follow
 * 400 — не можна підписатись на себе, 404 — юзера нема,
 * 409 — вже підписаний (для UI це той самий результат, що й успіх).
 */
export const followUser = createAsyncThunk(
  "users/followUser",
  async (userId, thunkAPI) => {
    try {
      await api.post(`/users/${userId}/follow`);
      return userId;
    } catch (error) {
      if (error.response?.status === 409) return userId;
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * DELETE @ /users/:id/follow
 * 404 — не був підписаний (для UI теж той самий результат, що й успіх).
 */
export const unfollowUser = createAsyncThunk(
  "users/unfollowUser",
  async (userId, thunkAPI) => {
    try {
      await api.delete(`/users/${userId}/follow`);
      return userId;
    } catch (error) {
      if (error.response?.status === 404) return userId;
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * PATCH @ /users/avatar
 * multipart/form-data, поле обов'язково називається "avatar".
 * Відповідь: { avatar: "<cloudinary-url>" }.
 */
export const updateAvatar = createAsyncThunk(
  "users/updateAvatar",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.avatar;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);
