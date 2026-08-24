import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const setAuthHeader = (token) => {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  delete api.defaults.headers.common.Authorization;
};

const getErrorMessage = (error) =>
  error.response?.data?.message || error.response?.data?.error || error.message;

/*
 * POST @ /auth/register
 * body: { name, email, password }
 */
export const register = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", credentials);
      // After successful registration, add the accessToken to the HTTP header
      setAuthHeader(res.data.accessToken);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * POST @ /auth/login
 * body: { name, password }
 */
export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", credentials);
      // After successful login, add the token to the HTTP header
      setAuthHeader(res.data.accessToken);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);

/*
 * POST @ /auth/logout
 * headers: Authorization: Bearer token
 */
export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await api.post("/auth/logout");
    // After a successful logout, remove the token from the HTTP header
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

/*
 * GET @ auth/refresh
 * headers: Authorization: Bearer token
 */
export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
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
  },
);
