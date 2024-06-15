import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Action Types
const GET_MESSAGES = "messages/getMessages";
const CREATE_MESSAGE = "messages/createMessage";
const DELETE_MESSAGE = "messages/deleteMessage";
const UPDATE_MESSAGE = "messages/updateMessage";

// Actions
const getMessages = (messages) => ({
  type: GET_MESSAGES,
  payload: messages,
});

const createMessage = (message) => ({
  type: CREATE_MESSAGE,
  payload: message,
});

const deleteMessage = (messageId) => ({
  type: DELETE_MESSAGE,
  payload: messageId,
});

const updateMessage = (message) => ({
  type: UPDATE_MESSAGE,
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

export const createMessageThunk = (channelId, content) => async (dispatch, getState) => {
  try {
    const { session: { user } } = getState();
    const response = await fetch(`/api/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...content, user: user.username }),
    });

    if (response.ok) {
      const newMessage = await response.json();
      dispatch(createMessage(newMessage));
    } else {
      console.error("Failed to create message:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Failed to create message:", error);
    return null;
  }
};


export const deleteMessageThunk = (messageId) => async (dispatch) => {
  try {
    const response = await axios.delete(`/api/messages/${messageId}`);
    if (response.status === 200) {
      dispatch(deleteMessage(messageId));
    }
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
};

export const updateMessageThunk = (messageId, content) => async (dispatch) => {
  try {
    const response = await fetch(`/api/messages/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });

    if (response.ok) {
      const updatedMessage = await response.json();
      dispatch(updateMessage(updatedMessage));
      return updatedMessage;
    } else {
      const errorData = await response.json();
      return { errors: errorData.errors };
    }
  } catch (error) {
    console.error("Failed to update message:", error);
    return { errors: { message: "Failed to update message." } };
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
    case DELETE_MESSAGE:
      return { ...state, messages: state.messages.filter(message => message.id !== action.payload) };
    case UPDATE_MESSAGE:
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.id ? action.payload : message
        ),
      };
    default:
      return state;
  }
};

export default messageReducer;
