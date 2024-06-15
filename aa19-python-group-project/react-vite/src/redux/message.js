import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"

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
    const response = await fetch(`/api/channels/${channelId}/messages`);
    if (response.ok) {
      const messages = await response.json();
      dispatch(getMessages(messages));
    } else {
      console.error("Failed to fetch messages:", response.statusText);
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
    }
  } catch (error) {
    console.error("Failed to create message:", error);
  }
};

export const deleteMessageThunk = (messageId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/messages/${messageId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(deleteMessage(messageId));
    } else {
      console.error("Failed to delete message:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
};

export const updateMessageThunk = (messageId, content) => async (dispatch, getState) => {
  try {
    const response = await fetch(`/api/messages/${messageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const updatedMessage = await response.json();
      dispatch(updateMessage(updatedMessage));
    } else {
      throw new Error('Failed to update message');
    }
  } catch (error) {
    console.error("Error updating message:", error);
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
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? action.payload : msg
        ),
      };
    default:
      return state;
  }
};

export default messageReducer;
