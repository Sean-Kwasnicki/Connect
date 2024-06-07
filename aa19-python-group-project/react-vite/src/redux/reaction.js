// import socket from '../socket';

// Action Types
const GET_REACTIONS = 'reactions/getReactions';
const ADD_REACTION = 'reactions/addReaction';
const REMOVE_REACTION = 'reactions/removeReaction';

///////////////////////////////////////////////////////

// Action Creators

const getReactions = (reactions) => {
  return {
    type: GET_REACTIONS,
    payload: reactions,
  };
};

// const addReactionAction = (reaction) => {
//   return {
//     type: ADD_REACTION,
//     payload: reaction,
//   };
// };

// const removeReactionAction = (emoji) => {
//   return {
//     type: REMOVE_REACTION,
//     payload: emoji,
//   };
// };

///////////////////////////////////////////////////////

// Thunks

export const getReactionsThunk = (messageId) => async (dispatch) => {
  const response = await fetch(`/api/messages/${messageId}/reactions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(getReactions(data));
  }
};

///////////////////////////////////////////////////////

// Reducer

const initialState = { reactions: [] };

const reactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REACTIONS:
      return { ...state, reactions: [...action.payload] };
    case ADD_REACTION:
      return { ...state, reactions: [...state.reactions, action.payload] };
    case REMOVE_REACTION:
      return {
        ...state,
        reactions: state.reactions.filter(reaction => reaction.emoji !== action.payload)
      };
    default:
      return state;
  }
};

export default reactionReducer;
