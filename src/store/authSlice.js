// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginAsync, checkAuthAsync } from './authThunks';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        user: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                localStorage.setItem('token', action.payload.token); // Store token
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to login';
            })
            .addCase(checkAuthAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(checkAuthAsync.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});




export const { logout } = authSlice.actions;
export default authSlice.reducer;

