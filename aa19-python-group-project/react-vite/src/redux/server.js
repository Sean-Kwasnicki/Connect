// src/redux/server.js
const GET_SERVERS = "servers/getServers";
const CREATE_SERVER = "servers/createServer";
const DELETE_SERVER = "servers/deleteServer";
const JOIN_SERVER = "servers/joinServer";
const LEAVE_SERVER = "servers/leaveServer";
const GET_MEMBERS = 'servers/getMembers';
const ADD_MEMBER = 'servers/addMember';


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

const getMembers = (members) => ({
  type: GET_MEMBERS,
  payload: members,
});

const addMember = (member) => ({
  type: ADD_MEMBER,
  payload: member,
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
    return data;
  }
  return [];
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

export const joinServerThunk = ({ serverId, username }) => async (dispatch) => {
  try {
    const response = await fetch(`/api/servers/${serverId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addMember(data.user));
      return data;
    } else {
      const errorData = await response.json();
      return { errors: errorData };
    }
  } catch (error) {
    return { errors: { message: 'Network error' } };
  }
};

export const getMembersThunk = (serverId) => async (dispatch) => {
  const response = await fetch(`/api/servers/${serverId}/members`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getMembers(data));
    return data;
  }
};

export const leaveServerThunk = (user) => async (dispatch) => {
  dispatch(leaveServer(user));
};

// Initial State
const initialState = { servers: [], users: [], members: [] };

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
        ({ id }) => id !== Number(action.payload)
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
    case GET_MEMBERS: {
      return { ...state, members: action.payload };
    }
    case ADD_MEMBER: {
      return { ...state, members: [...state.members, action.payload] };
    }
    default:
      return state;
  }
}

export default serverReducer;
