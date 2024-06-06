const GET_SERVERS = "servers/getServers";
const CREATE_SERVER = "severs/createServer";
const DELETE_SERVER = "server/deleteServer";

///////////////////////////////////////////////////////

const getServers = (servers) => {
  return {
    type: GET_SERVERS,
    payload: servers,
  };
};

const createServer = (server) => {
  return {
    type: CREATE_SERVER,
    payload: server,
  };
};

const deleteServer = (serverId) => {
  return {
    type: DELETE_SERVER,
    payload: serverId,
  };
};

///////////////////////////////////////////////////////

export const createServerThunk = (server) => async (dispatch) => {
  const response = await fetch("/api/servers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(server),
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(createServer(data));
  }
  return data;
};

export const getServersThunk = () => async (dispatch) => {
  const response = await fetch("/api/servers");
  if (response.ok) {
    const data = await response.json();
    dispatch(getServers(data));
  }
};

export const deleteServerThunk = (serverId) => async (dispatch) => {
  console.log(`/api/servers/${serverId}`)
  const response = await fetch(`/api/servers/${serverId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteServer(serverId));
    return "good";
  }
  return "bad";
};

///////////////////////////////////////////////////////

const initialState = { servers: [] };

function serverReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SERVERS: {
      return { ...state, servers: [...action.payload] };
    }
    case CREATE_SERVER: {
      return { ...state, servers: [action.payload, ...state.servers] };
    }
    case DELETE_SERVER: {
      const currentServers = state.servers.filter(
        ({ id }) => id !== action.payload
      );
      return { ...state, servers: currentServers };
    }
    default:
      return state;
  }
}

export default serverReducer;
