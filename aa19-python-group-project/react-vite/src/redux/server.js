const GET_SERVERS = "servers/getServers";

///////////////////////////////////////////////////////

const getServers = (servers) => {
  return {
    type: GET_SERVERS,
    payload: servers,
  };
};

///////////////////////////////////////////////////////

export const getServersThunk = () => async (dispatch) => {
  const response = await fetch("/api/servers");
  if (response.ok) {
    const data = await response.json();
    dispatch(getServers(data));
  }
};

///////////////////////////////////////////////////////

const initialState = { servers: [] };

function serverReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SERVERS:
      return { ...state, servers: [...action.payload] };
    default:
      return state;
  }
}

export default serverReducer;
