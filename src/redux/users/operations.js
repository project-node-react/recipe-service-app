import { api, getErrorMessage } from "../auth/operations";
import { createAsyncThunk } from "@reduxjs/toolkit";

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

export const fetchUserRecipesById = createAsyncThunk(
  "users/fetchUserRecipesById",
  async ({ userId, page = 1, limit = 12 }, thunkAPI) => {
    try {
      const response = await api.get(`/users/${userId}/recipes`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

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

export const fetchFollowers = createAsyncThunk(
  "users/fetchFollowers",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/users/${userId}/followers`);
      return response.data.data ?? response.data.followers ?? [];
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchFollowing = createAsyncThunk(
  "users/fetchFollowing",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users/following");
      return response.data.data ?? response.data.following ?? [];
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchUserRecipesPreview = createAsyncThunk(
  "users/fetchUserRecipesPreview",
  async (userId, thunkAPI) => {
    try {
      const response = await api.get(`/users/${userId}/recipes`, {
        params: { page: 1, limit: 4 },
      });
      return {
        userId,
        totalItems: response.data.totalItems,
        recipes: response.data.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const followUser = createAsyncThunk(
  "users/followUser",
  async (userId, thunkAPI) => {
    const me = thunkAPI.getState().auth.user;
    try {
      await api.post(`/users/${userId}/follow`);
      return { userId, me };
    } catch (error) {
      if (error.response?.status === 409) return { userId, me };
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

export const unfollowUser = createAsyncThunk(
  "users/unfollowUser",
  async (userId, thunkAPI) => {
    const me = thunkAPI.getState().auth.user;
    try {
      await api.delete(`/users/${userId}/follow`);
      return { userId, me };
    } catch (error) {
      if (error.response?.status === 404) return { userId, me };
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

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
