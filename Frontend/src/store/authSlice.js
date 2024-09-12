import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Utility functions for base64 encoding and decoding
const encodeBase64 = (data) => btoa(JSON.stringify(data));
const decodeBase64 = (data) => JSON.parse(atob(data));

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? decodeBase64(user) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      try {
        localStorage.setItem('user', encodeBase64(action.payload));
      } catch (error) {
        console.error('Failed to save user to localStorage:', error);
      }
      state.error = null;
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, setToken, clearUser, setLoading, setError } = authSlice.actions;

export const fetchProfile = () => async (dispatch, getState) => {
  const { token } = getState().auth;

  if (!token) {
    dispatch(setError('No token available'));
    return;
  }

  dispatch(setLoading(true));
  
  try {
    const response = await axios.get('http://localhost:3000/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    dispatch(setUser(response.data));
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to fetch profile';
    dispatch(setError(errorMsg));
    console.error('Failed to fetch profile', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const login = (credentials) => async (dispatch) => {
  dispatch(setLoading(true));
  
  try {
    const response = await axios.post('http://localhost:3000/api/login', credentials);
    const { token, user } = response.data;
    dispatch(setToken(token));
    dispatch(setUser(user));
  } catch (error) {
    const errorMsg = error.response?.data?.error || 'Login failed';
    dispatch(setError(errorMsg));
    console.error('Login failed', error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => (dispatch) => {
  dispatch(clearUser());
};

export default authSlice.reducer;
