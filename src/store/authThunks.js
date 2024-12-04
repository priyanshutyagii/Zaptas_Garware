// src/store/authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../utils/apiCall';
import ConnectMe from '../config/connect';


// Async thunk for login API call
export const loginAsync = createAsyncThunk(
    'auth/loginAsync',
    async (credentials, { rejectWithValue }) => {
        try {
            return await apiCall('POST', `${ConnectMe.BASE_URL}/sso/login`, {}, credentials);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk for auto-login
export const checkAuthAsync = createAsyncThunk(
    'auth/checkAuthAsync',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                return await apiCall('GET', `${ConnectMe.BASE_URL}/sso/verifyToken`, { Authorization: `Bearer ${token}` });
            }
            return rejectWithValue('No token found');
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);