import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchDirectMessages = createAsyncThunk('directMessages/fetchDirectMessages', async () => {
    const response = await axios.get(`/api/direct_messages`);
    return response.data.DirectMessages;
});

export const createDirectMessage = createAsyncThunk(
    'directMessages/createDirectMessage',
    async ({ receiverId, content }) => {
        const response = await fetch(`/api/direct_messages/${receiverId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Request failed with status ${response.status}: ${errorData.error}`);
        }

        return await response.json();
    }
);

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
