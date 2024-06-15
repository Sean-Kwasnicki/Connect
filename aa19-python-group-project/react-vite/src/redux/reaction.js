
// Action Types
const GET_REACTIONS = "reactions/getReactions";
const ADD_REACTION = "reactions/addReaction";
const REMOVE_REACTION = "reactions/removeReaction";

// Actions
const getReactions = (messageId, reactions) => ({
  type: GET_REACTIONS,
  payload: { messageId, reactions },
});

export const addReaction = (reaction) => ({
  type: ADD_REACTION,
  payload: reaction,
});

export const removeReaction = (reactionId, messageId) => ({
  type: REMOVE_REACTION,
  payload: { reactionId, messageId },
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
      dispatch(getReactions(messageId, data.reactions));
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
      const newReaction = await response.json(); 
      dispatch(addReaction(newReaction));
      return newReaction;
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
      dispatch(removeReaction(reactionId, messageId));
    } else {
      console.error("Failed to remove reaction:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to remove reaction:", error);
  }
};

// Initial State
const initialState = { reactionsByMessageId: {} };

// Reducer
const reactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REACTIONS:
      return {
        ...state,
        reactionsByMessageId: {
          ...state.reactionsByMessageId,
          [action.payload.messageId]: action.payload.reactions
        }
      };
    case ADD_REACTION:
      return {
        ...state,
        reactionsByMessageId: {
          ...state.reactionsByMessageId,
          [action.payload.message_id]: [
            ...(state.reactionsByMessageId[action.payload.message_id] || []),
            action.payload
          ]
        }
      };
    case REMOVE_REACTION:
      return {
        ...state,
        reactionsByMessageId: {
          ...state.reactionsByMessageId,
          [action.payload.messageId]: state.reactionsByMessageId[action.payload.messageId].filter(
            (reaction) => reaction.id !== action.payload.reactionId
          )
        }
      };
    default:
      return state;
  }
};

export default reactionsReducer;
