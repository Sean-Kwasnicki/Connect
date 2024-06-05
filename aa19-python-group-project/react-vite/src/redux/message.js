const GET_MESSAGES = "messages/getMessages";
const CREATE_MESSAGE = "messages/createMessage";

///////////////////////////////////////////////////////

const getMessages = (messages) => {
  return {
    type: GET_MESSAGES,
    payload: messages,
  };
};

const createMessage = (message) => {
  return {
    type: CREATE_MESSAGE,
    payload: message,
  };
};

///////////////////////////////////////////////////////

export const getMessagesThunk = (channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}/messages`);
  if (response.ok) {
    const messages = await response.json();
    dispatch(getMessages(messages));
    return "good"
  }
};

export const createMessageThunk = (channelId, message) => async (dispatch) => {
  console.log(channelId, message)
  const response = await fetch(`/api/channels/${channelId}/messages`, {
    method: "POST",
    "Content-Type": "application/json",
    body: JSON.stringify(message),
  });

  if (response.ok) {
    const newMessage = await response.json();
    dispatch(createMessage(newMessage));
    return "good"
  }
};

///////////////////////////////////////////////////////

const initialState = { messages: [] };

function messageReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGES:
      return { ...state, messages: [...action.payload] };
    case CREATE_MESSAGE: {
      return { ...state, messages: [action.payload, ...state.messages] };
    }
    default:
      return state;
  }
}

export default messageReducer;
