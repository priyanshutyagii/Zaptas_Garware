// src/slices/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../utils/apiCall';
import ConnectMe from '../config/connect';


export const fetchCompanyDetails = createAsyncThunk(
    'company/fetchDetails',
    async (_, { rejectWithValue }) => {
        try {
            return await apiCall('GET', `${ConnectMe.BASE_URL}/admin/details`, {});
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const companySlice = createSlice({
    name: 'company',
    initialState: {
        details: {},
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanyDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.details = action.payload;
            })
            .addCase(fetchCompanyDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});



export default companySlice.reducer;
