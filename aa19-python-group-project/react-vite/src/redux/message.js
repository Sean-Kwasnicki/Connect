import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Action Types
const GET_MESSAGES = "messages/getMessages";
const CREATE_MESSAGE = "messages/createMessage";
const DELETE_MESSAGE = "messages/deleteMessage";

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

// Thunks
export const getMessagesThunk = (channelId) => async (dispatch) => {
  try {
    const response = await axios.get(`/api/channels/${channelId}/messages`);
    if (response.status === 200) {
      const messages = response.data;
      dispatch(getMessages(messages));
    }
  } catch (error) {
    return error("Failed to fetch messages:", error);
  }
};

export const createMessageThunk =
  (channelId, content) => async (dispatch, getState) => {
    try {
      const {
        session: { user },
      } = getState();
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
        return null;
      }
    } catch (error) {
      return null;
    }
  };

export const deleteMessageThunk = (messageId) => async (dispatch) => {
  const raw = await fetch(`/api/messages/${messageId}`, {
    method: "DELETE",
  });

  if (raw.status === 200) {
    const response = await raw.json();
    dispatch(deleteMessage(messageId));
    return response;
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
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

export default messageReducer;
