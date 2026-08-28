import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

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

let isRefreshingToken = false;
let pendingRequests = [];

const resolvePendingRequests = (token) => {
  pendingRequests.forEach((resolve) => resolve(token));
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthCall = originalRequest?.url?.startsWith("/auth/");

    if (status !== 401 || !originalRequest || isAuthCall || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshingToken) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshingToken = true;

    try {
      const refreshRes = await api.post("/auth/refresh");
      const newToken = refreshRes.data.accessToken;
      setAuthHeader(newToken);

      const { store } = await import("../store");
      store.dispatch({ type: "auth/tokenRefreshed", payload: newToken });

      resolvePendingRequests(newToken);
      isRefreshingToken = false;

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshingToken = false;
      resolvePendingRequests(null);
      clearAuthHeader();

      const { store } = await import("../store");
      store.dispatch({ type: "auth/sessionExpired" });
      toast.error("Your session has expired. Please sign in again.");

      return Promise.reject(error);
    }
  },
);

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
