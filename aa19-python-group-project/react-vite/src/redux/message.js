import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Action Types
const GET_MESSAGES = "messages/getMessages";
const CREATE_MESSAGE = "messages/createMessage";

// Actions
const getMessages = (messages) => ({
  type: GET_MESSAGES,
  payload: messages,
});

const createMessage = (message) => ({
  type: CREATE_MESSAGE,
  payload: message,
});

// Thunks
export const getMessagesThunk = (channelId) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/channels/${channelId}/messages`);
    if (response.status === 200) {
      const messages = response.data;
      dispatch(getMessages(messages));
    }
  } catch (error) {
    console.error("Failed to fetch messages:", error);
  }
};

export const createMessageThunk = (channelId, content) => async (dispatch) => {
  try {
    const response = await axios.post(`/api/channels/${channelId}/messages`, { content });
    if (response.status === 201) {
      const newMessage = response.data;
      dispatch(createMessage(newMessage));
    }
  } catch (error) {
    console.error("Failed to create message:", error);
  }
};

// Initial State
const initialState = {
  messages: [],
};

// Reducer
const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return { ...state, messages: action.payload };
    case CREATE_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

export default messageReducer;
