import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../auth/operations";

export const fetchAreas = createAsyncThunk(
  "areas/fetchAreas",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/areas");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);