// src/redux/server.js
const GET_SERVERS = "servers/getServers";
const CREATE_SERVER = "servers/createServer";
const DELETE_SERVER = "servers/deleteServer";
const JOIN_SERVER = "servers/joinServer";
const LEAVE_SERVER = "servers/leaveServer";

// Action Creators
const getServers = (servers) => ({
  type: GET_SERVERS,
  payload: servers,
});

const createServer = (server) => ({
  type: CREATE_SERVER,
  payload: server,
});

const deleteServer = (serverId) => ({
  type: DELETE_SERVER,
  payload: serverId,
});

const joinServer = (user) => ({
  type: JOIN_SERVER,
  payload: user,
});

const leaveServer = (user) => ({
  type: LEAVE_SERVER,
  payload: user,
});

// Thunks
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
  const response = await fetch(`/api/servers/${serverId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteServer(serverId));
    return "good";
  }
  return "bad";
};

export const joinServerThunk = (user) => async (dispatch) => {
  dispatch(joinServer(user));
};

export const leaveServerThunk = (user) => async (dispatch) => {
  dispatch(leaveServer(user));
};

// Initial State
const initialState = { servers: [], users: [] };

// Reducer
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
    case JOIN_SERVER: {
      return { ...state, users: [...state.users, action.payload] };
    }
    case LEAVE_SERVER: {
      return {
        ...state,
        users: state.users.filter((user) => user !== action.payload),
      };
    }
    default:
      return state;
  }
}

export default serverReducer;
