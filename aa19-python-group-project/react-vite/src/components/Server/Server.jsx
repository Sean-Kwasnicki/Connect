import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getChannelsThunk, createChannel, deleteChannel } from "../../redux/channel";
import CreateChannelButton from "../Modals/CreateChannelModal";
import DeleteServerModalButton from "../Modals/DeleteServerModal";
import DeleteChannelModalButton from "../Modals/DeleteChannelModal/DeleteChannelModalButton";

const socket = io.connect("/");


const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const channels = useSelector((state) => state.channels.channels);
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);

  const [usersInServer, setUsersInServer] = useState([]);

  const currentServer = servers.find(server => server.id === parseInt(serverId));
  const serverName = currentServer ? currentServer.name : '';

  useEffect(() => {
    console.log('Connecting to WebSocket server');
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    dispatch(getChannelsThunk(serverId));

    if (serverId && user) {
      socket.emit('join_server', { server: serverId, user: user.username });
      console.log(`User ${user.username} joined server ${serverId}`);

      socket.on('update_users', (data) => {
        if (data.server === serverId) {
          setUsersInServer(data.users);
        }
      });

      socket.on('new_channel', (channel) => {
        dispatch(createChannel(channel));
      });

      socket.on('remove_channel', (channelId) => {
        console.log('Received remove_channel event with channelId:', channelId);
        dispatch(deleteChannel(channelId));
        // Optional: Navigate to a different channel or server page if needed
        if (channelId === parseInt(serverId)) {
          navigate(`/servers/${serverId}`);
        }
      });

      return () => {
        socket.emit('leave_server', { server: serverId, user: user.username });
        console.log(`User ${user.username} left server ${serverId}`);
        socket.off('update_users');
        socket.off('new_channel');
        socket.off('remove_channel');
      };
    }
  }, [dispatch, serverId, user, navigate]);

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
              <DeleteChannelModalButton channelId={id} />
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
