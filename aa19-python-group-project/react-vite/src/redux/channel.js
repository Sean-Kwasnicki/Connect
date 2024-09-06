const GET_CHANNELS = "channels/getChannels";
const CREATE_CHANNEL = "channels/createChannel";
const DELETE_CHANNEL = "channels/deleteChannel";
const UPDATE_CHANNEL = "channels/updateChannel";

///////////////////////////////////////////////////////

const getChannels = (serverId, channels) => {
  return {
    type: GET_CHANNELS,
    payload: { serverId, channels },
  };
};

export const createChannel = (serverId, newChannel) => {
  return {
    type: CREATE_CHANNEL,
    payload: {
      serverId,
      newChannel,
    },
  };
};

export const deleteChannel = (serverId, channelId) => {
  return {
    type: DELETE_CHANNEL,
    payload: {
      serverId,
      channelId,
    },
  };
};

export const updateChannel = (serverId, updatedChannel) => {
  return {
    type: UPDATE_CHANNEL,
    payload: { serverId, updatedChannel },
  };
};

///////////////////////////////////////////////////////

export const getChannelsThunk = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/channels`);
  if (response.ok) {
    const { channels } = await response.json();
    dispatch(getChannels(serverId, channels));
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
    dispatch(createChannel(serverId, newChannel));
    return newChannel;
  }
  return "bad";
};

export const deleteChannelThunk = (serverId, channelId) => async (dispatch) => {
  const response = await fetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteChannel(serverId, channelId));
    return "good";
  }
  return "bad";
};

export const updateChannelThunk =
  (serverId, channelId, channelData) => async (dispatch) => {
    const response = await fetch(`/api/channels/${channelId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(channelData),
    });

    if (response.ok) {
      const updatedChannel = await response.json();
      dispatch(updateChannel(serverId, updatedChannel));
      return updatedChannel;
    } else {
      const errorData = await response.json();
      return { errors: errorData.errors };
    }
  };

///////////////////////////////////////////////////////

const initialState = {};

function channelReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHANNELS: {
      const { serverId, channels } = action.payload;
      const newState = { ...state };
      newState[serverId] = channels;
      return newState;
    }
    case CREATE_CHANNEL: {
      const newState = { ...state };
      const { serverId, newChannel } = action.payload;
      //copy over all channels and add new one at end of the array
      newState[serverId] = [...newState[serverId], newChannel];
      return newState;
    }
    case DELETE_CHANNEL: {
      const newState = { ...state };
      const { serverId, channelId } = action.payload;
      //copy over all current channels except for the deleted one
      newState[serverId] = state[serverId].filter(({ id }) => id !== channelId);
      return newState;
    }
    case UPDATE_CHANNEL: {
      const newState = { ...state };
      const { serverId, updatedChannel } = action.payload;
      //copy over all channels, but update updated channel
      newState[serverId] = state[serverId].map((channel) => {
        if (channel.id === updatedChannel.id) {
          return updatedChannel;
        }
        return channel;
      });
      return newState;
    }
    default:
      return state;
  }
}

export default channelReducer;
