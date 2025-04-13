import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import urlReducer from './features/urlSlice';



export const store = configureStore({
  reducer: {
    auth: authReducer,
    url: urlReducer,
  },
});