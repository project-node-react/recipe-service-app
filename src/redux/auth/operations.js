import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Додаємо /api до базової URL-адреси
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL.replace(/\/$/, "")}/api`,
  withCredentials: true,
});

export const setAuthHeader = (token) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete api.defaults.headers.common.Authorization;
};

export const getErrorMessage = (error) =>
  error.response?.data?.message || error.response?.data?.error || error.message;

/*
 * POST @ /api/auth/register
 * body: { name, email, password }
 */
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", credentials);
      setAuthHeader(res.data.accessToken);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
 * POST @ /api/auth/login
 * body: { email, password }
 */
export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", credentials);
      setAuthHeader(res.data.accessToken);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

/*
 * POST @ /api/auth/logout
 * headers: Authorization: Bearer token
 */
export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth?.token || state.auth?.accessToken;

  if (token) {
    setAuthHeader(token);
  }

  try {
    await api.post("/auth/logout");
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  } finally {
    clearAuthHeader();
  }
});

/*
 * POST @ /api/auth/refresh
 * GET @ /api/users/current
 */
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      clearAuthHeader();
      const refreshRes = await api.post("/auth/refresh");
      const newAccessToken = refreshRes.data.accessToken;
      setAuthHeader(newAccessToken);
      const userRes = await api.get("/users/current");

      return {
        accessToken: newAccessToken,
        user: userRes.data,
      };
    } catch (error) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);