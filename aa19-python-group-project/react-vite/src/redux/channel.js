const GET_CHANNELS = "channels/getChannels";
const CREATE_CHANNEL = "channels/createChannel";

///////////////////////////////////////////////////////

const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    payload: channels,
  };
};

const createChannel = (channel) => {
  return {
    type: CREATE_CHANNEL,
    payload: channel,
  };
};

///////////////////////////////////////////////////////

export const getChannelsThunk = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/channels`);
  if (response.ok) {
    const { channels } = await response.json();
    dispatch(getChannels(channels));
  }
};

export const createChannelThunk = (serverId, channel) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/channels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channel),
  });

  if (response.ok) {
    const newChannel = await response.json();
    dispatch(createChannel(newChannel));
    return newChannel;
  }
  return "bad";
};

///////////////////////////////////////////////////////

const initialState = { channels: [] };

function channelReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHANNELS:
      return { ...state, channels: [...action.payload] };
    case CREATE_CHANNEL:
      return { ...state, channels: [...state.channels, action.payload] };
    default:
      return state;
  }
}

export default channelReducer;
