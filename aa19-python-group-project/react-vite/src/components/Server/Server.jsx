import { NavLink, Outlet, useParams } from "react-router-dom";
import { getChannelsThunk } from "../../redux/channel";
import { deleteServerThunk } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import s from "./Server.module.css";
import CreateChannelButton from "../Modals/CreateChannelModal";
import DeleteServerModalButton from "../Modals/DeleteServerModal";
import io from "socket.io-client"

const socket = io.connect("/");

const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.channels);
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);

  const [usersInServer, setUsersInServer] = useState([]);

  // Find the server name based on serverId
  const currentServer = servers.find(server => server.id === parseInt(serverId));
  const serverName = currentServer ? currentServer.name : '';

  useEffect(() => {
    dispatch(getChannelsThunk(serverId));
  }, [dispatch, serverId]);


  useEffect(() => {
    if (serverId && user) {
      // Emit join event when user enters the server
      socket.emit('join', { server: serverId, user: user.username });  // Was previously 'room'

      // Listen for update_users event and update state
      socket.on('update_users', (data) => {
        if (data.server === serverId) {  // Was previously 'room'
          setUsersInServer(data.users);
        }
      });

      // Cleanup on component unmount
      return () => {
        socket.emit('leave', { server: serverId, user: user.username });  // Was previously 'room'
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
        <DeleteServerModalButton />
        <CreateChannelButton />
      </ul>
      <div className="users">
        <h3>Users in {serverName}</h3>
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
