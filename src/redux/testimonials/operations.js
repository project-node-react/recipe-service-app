import { createAsyncThunk } from '@reduxjs/toolkit';

import { api, getErrorMessage } from '../auth/operations';

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/testimonials');

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  },
);
