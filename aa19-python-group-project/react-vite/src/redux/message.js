const GET_MESSAGES = "messages/getMessages";

///////////////////////////////////////////////////////

const getMessages = (messages) => {
  return {
    type: GET_MESSAGES,
    payload: messages,
  };
};

///////////////////////////////////////////////////////

export const getMessagesThunk = (channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}/messages`);
  if (response.ok) {
    const messages = await response.json();
    dispatch(getMessages(messages));
  }
};

///////////////////////////////////////////////////////

const initialState = { messages: [] };

function messageReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGES:
      return { ...state, messages: [...action.payload] };
    default:
      return state;
  }
}

export default messageReducer;
