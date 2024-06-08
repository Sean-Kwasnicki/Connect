// src/redux/reactionSlice.js

// Action Types
const GET_REACTIONS = "reactions/getReactions";
const ADD_REACTION = "reactions/addReaction";
const REMOVE_REACTION = "reactions/removeReaction";

// Actions
const getReactions = (reactions) => ({
  type: GET_REACTIONS,
  payload: reactions,
});

const addReaction = (reaction) => ({
  type: ADD_REACTION,
  payload: reaction,
});

const removeReaction = (reactionId) => ({
  type: REMOVE_REACTION,
  payload: reactionId,
});

// Thunks
export const getReactionsThunk = (channelId, messageId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channelId}/messages/${messageId}/reactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(getReactions(data.reactions));
    }
  } catch (error) {
    console.error("Failed to fetch reactions:", error);
  }
};

export const addReactionThunk = (channelId, messageId, emoji) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channelId}/messages/${messageId}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emoji }),
    });

    if (response.ok) {
      const newReaction = await response.json(); // Parse the JSON data from the response
      dispatch(addReaction(newReaction));
      dispatch(getReactionsThunk(channelId, messageId)); // Ensure to get the updated reactions
    } else {
      console.error("Failed to add reaction:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to add reaction:", error);
  }
};

export const removeReactionThunk = (channelId, messageId, reactionId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channelId}/messages/${messageId}/reactions/${reactionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      dispatch(removeReaction(reactionId));
      dispatch(getReactionsThunk(channelId, messageId)); // Ensure to get the updated reactions
    } else {
      console.error("Failed to remove reaction:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to remove reaction:", error);
  }
};

// Initial State
const initialState = {
  reactions: [],
};

// Reducer
const reactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REACTIONS:
      return { ...state, reactions: action.payload };
    case ADD_REACTION:
      return { ...state, reactions: [...state.reactions, action.payload] };
    case REMOVE_REACTION:
      return {
        ...state,
        reactions: state.reactions.filter((reaction) => reaction.id !== action.payload),
      };
    default:
      return state;
  }
};

export default reactionsReducer;
