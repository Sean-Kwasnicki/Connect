const GET_CHANNELS = "channels/getChannels";
const CREATE_CHANNEL = "channels/createChannel";
const DELETE_CHANNEL = "channels/deleteChannel";
const UPDATE_CHANNEL = "channels/updateChannel";

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

export const deleteChannel = (channelId) => {
  return {
    type: DELETE_CHANNEL,
    payload: channelId,
  };
};

export const updateChannel = (channel) => {
  return {
    type: UPDATE_CHANNEL,
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

export const deleteChannelThunk = (channelId, serverId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteChannel(channelId));
    return "good";
  }
  return "bad";
};

export const updateChannelThunk = (channelId, channelData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/channels/${channelId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(channelData),
    });

    if (response.ok) {
      const updatedChannel = await response.json();
      dispatch(updateChannel(updatedChannel));
      return updatedChannel;
    } else {
      const errorData = await response.json();
      return { errors: errorData.errors };
    }
  } catch (error) {
    console.error("Failed to update channel:", error);
    return { errors: { message: "Failed to update channel." } };
  }
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
    case UPDATE_CHANNEL: {
      const updatedChannels = state.channels.map(channel =>
        channel.id === action.payload.id ? action.payload : channel
      );
      return { ...state, channels: updatedChannels };
    }
    default:
      return state;
  }
}

export default channelReducer;
