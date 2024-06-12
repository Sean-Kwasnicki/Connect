import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for fetching users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data.users;
});

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default usersSlice.reducer;
