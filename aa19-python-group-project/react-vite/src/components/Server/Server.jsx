import { NavLink, Outlet, useParams } from "react-router-dom";
import { getChannelsThunk, createChannel, deleteChannel } from "../../redux/channel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import s from "./Server.module.css";
import CreateChannelModalButton from "../Modals/CreateChannelModal/CreateChannelModalButton";
import DeleteServerModalButton from "../Modals/DeleteServerModal/DeleteServerModalButton";
import DeleteChannelModalButton from "../Modals/DeleteChannelModal/DeleteChannelModalButton";
import io from "socket.io-client";

// Initialize socket
const socket = io.connect("/");

const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();

  // const channels = useSelector((state) => state.channels.channels);
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);

  const [usersInServer, setUsersInServer] = useState([]);
  const [channels, setChannels] = useState([]);

  const currentServer = servers.find(server => server.id === parseInt(serverId));
  const serverName = currentServer ? currentServer.name : '';

  // Fetch channels initially
  useEffect(() => {
    const fetchChannels = async () => {
      const response = await dispatch(getChannelsThunk(serverId));
      if (response) {
        setChannels(response.payload);
      }
    };

    fetchChannels();
  }, [dispatch, serverId]);

  // WebSocket event listeners
  useEffect(() => {
    if (serverId && user) {
      socket.emit('join_server', { server: serverId, user: user.username });

      socket.on('update_users', (data) => {
        console.log(`Updated Users in the channel`);  // Debugging line
        if (data.server === serverId) {
          setUsersInServer(data.users);
        }
      });

      socket.on('new_channel', (channel) => {
        setChannels(prevChannels => [...prevChannels, channel]);
      });

      socket.on('remove_channel', ({ channelId }) => {
        console.log(`Received remove_channel event for channelId ${channelId}`);  // Debugging line
        setChannels(prevChannels => prevChannels.filter(channel => channel.id !== channelId));
      });

      return () => {
        socket.emit('leave_server', { server: serverId, user: user.username });
        socket.off('update_users');
        socket.off('new_channel');
        socket.off('remove_channel');
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
              <DeleteChannelModalButton channelId={id} />
            </li>
          );
        })}
        <DeleteServerModalButton />
        <CreateChannelModalButton />
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
