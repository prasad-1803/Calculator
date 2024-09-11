import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/authSlice'; // Update the path if necessary

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
