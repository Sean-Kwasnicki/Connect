import { NavLink, Outlet, useParams } from "react-router-dom";
import { getChannelsThunk } from "../../redux/channel";
import { deleteServerThunk } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import s from "./Server.module.css";
import io from 'socket.io-client';

// Connect to the SocketIO server
const socket = io.connect("/");

const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.channels);
  const user = useSelector((state) => state.session.user);
  const [usersInServer, setUsersInServer] = useState([]);

  useEffect(() => {
    dispatch(getChannelsThunk(serverId));
  }, [dispatch, serverId]);


  useEffect(() => {
    if (serverId && user) {
      // Emit join event when user enters the server
      socket.emit('join', { room: serverId, user: user.username });

      // Listen for update_users event and update state
      socket.on('update_users', (data) => {
        if (data.room === serverId) {
          setUsersInServer(data.users);
        }
      });

      // Cleanup on component unmount
      return () => {
        socket.emit('leave', { room: serverId, user: user.username });
        socket.off('update_users');
      };
    }
  }, [serverId, user]);

  return (
    <>
      <ul className="channels">
        {channels.map(({ name, id }) => {
          const navTo = `/servers/${serverId}/channels/${id}`;
          return (
            <li key={id}>
              <NavLink key={id} to={navTo} className="server">
                {name}
              </NavLink>
            </li>
          );
        })}
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(deleteServerThunk(serverId));
          }}
        >
          Delete Server!
        </button>
      </ul>
      <div className="users">
        <h3>Users in Server</h3>
        <ul>
          {usersInServer.map((username, index) => (
            <li key={index}>{username}</li>
          ))}
        </ul>
      </div>
      <Outlet />
    </>
  );
};

export default Server;
