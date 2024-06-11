const GET_CHANNELS = "channels/getChannels";
const CREATE_CHANNEL = "channels/createChannel";
const DELETE_CHANNEL = "channels/deleteChannel";

///////////////////////////////////////////////////////

const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    payload: channels,
  };
};

export const createChannel = (channel) => {
  return {
    type: CREATE_CHANNEL,
    payload: channel,
  };
};

const deleteChannel = (channelId) => {
  return {
    type: DELETE_CHANNEL,
    payload: channelId,
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

export const deleteChannelThunk = (channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteChannel(channelId));
    return "good";
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
    case DELETE_CHANNEL: {
      const currentChannels = state.channels.filter(
        ({ id }) => id !== Number(action.payload)
      );
      return { ...state, channels: [...currentChannels] };
    }
    default:
      return state;
  }
}

export default channelReducer;
