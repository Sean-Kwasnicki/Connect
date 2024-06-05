const GET_CHANNELS = "channels/getChannels";

///////////////////////////////////////////////////////

const getChannels = (channels) => {
  return {
    type: GET_CHANNELS,
    payload: channels,
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

///////////////////////////////////////////////////////

const initialState = { channels: [] };

function channelReducer(state = initialState, action) {
  switch (action.type) {
    case GET_CHANNELS:
      return { ...state, channels: [...action.payload] };
    default:
      return state;
  }
}

export default channelReducer;
