import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create short URL
export const createShortUrl = createAsyncThunk(
  'url/create',
  async (urlData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/urls`, urlData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch user's URLs with analytics
export const fetchUrls = createAsyncThunk(
  'url/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/urls`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get analytics for a specific URL
export const getUrlAnalytics = createAsyncThunk(
  'url/analytics',
  async (shortId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/urls/${shortId}/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  urls: [],
  selectedUrlAnalytics: null,
  loading: false,
  error: null,
  success: false
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    clearUrlError: (state) => {
      state.error = null;
      state.success = false;
    },
    clearSelectedAnalytics: (state) => {
      state.selectedUrlAnalytics = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create URL cases
      .addCase(createShortUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.urls.unshift(action.payload);
        state.success = true;
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch URLs cases
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = action.payload;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Analytics cases
      .addCase(getUrlAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUrlAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUrlAnalytics = action.payload;
      })
      .addCase(getUrlAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearUrlError, clearSelectedAnalytics } = urlSlice.actions;
export default urlSlice.reducer;