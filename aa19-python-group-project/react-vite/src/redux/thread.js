import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchThreads = createAsyncThunk('threads/fetchThreads', async (channelId) => {
    const response = await axios.get(`/api/threads`);
    return response.data.Threads;
});

export const createThread = createAsyncThunk('threads/createThread', async (messageId) => {
    const response = await axios.post(`/api/threads`, { message_id: messageId });
    return response.data;
});

// Slice
const threadsSlice = createSlice({
    name: 'threads',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchThreads.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(createThread.fulfilled, (state, action) => {
                state.push(action.payload);
            });
    },
});

export default threadsSlice.reducer;
