import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchDirectMessages = createAsyncThunk('directMessages/fetchDirectMessages', async () => {
    const response = await axios.get(`/api/direct_messages`);
    return response.data.DirectMessages;
});

export const createDirectMessage = createAsyncThunk('directMessages/createDirectMessage', async ({ receiverId, content }) => {
    const response = await axios.post(`/api/direct_messages`, { receiver_id: receiverId, content });
    return response.data;
});

// Slice
const directMessagesSlice = createSlice({
    name: 'directMessages',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchDirectMessages.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(createDirectMessage.fulfilled, (state, action) => {
                state.push(action.payload);
            });
    },
});

export default directMessagesSlice.reducer;
