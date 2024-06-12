import { NavLink, Outlet, useParams } from "react-router-dom";
import { getChannelsThunk, createChannel } from "../../redux/channel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import s from "./Server.module.css";
import CreateChannelButton from "../Modals/CreateChannelModal";
import DeleteServerModalButton from "../Modals/DeleteServerModal";
import io from "socket.io-client";

const socket = io.connect("/");

const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.channels);
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);

  const [usersInServer, setUsersInServer] = useState([]);

  const currentServer = servers.find(server => server.id === parseInt(serverId));
  const serverName = currentServer ? currentServer.name : '';

  useEffect(() => {
    dispatch(getChannelsThunk(serverId));

    if (serverId && user) {
      socket.emit('join_server', { server: serverId, user: user.username });

      socket.on('update_users', (data) => {
        if (data.server === serverId) {
          setUsersInServer(data.users);
        }
      });

      socket.on('new_channel', (channel) => {
        dispatch(createChannel(channel));
      });

      return () => {
        socket.emit('leave_server', { server: serverId, user: user.username });
        socket.off('update_users');
        socket.off('new_channel');
      };
    }
  }, [dispatch, serverId, user]);

  return (
    <div className={s.channels}>
      <ul>
        {channels.map(({ name, id }) => {
          const navTo = `/servers/${serverId}/channels/${id}`;
          return (
            <li key={id}>
              <NavLink key={id} to={navTo} className={s.server}>
                {name}
              </NavLink>
            </li>
          );
        })}
        <DeleteServerModalButton />
        <CreateChannelButton />
      </ul>
      <Outlet />
    </div>
  );
};

export default Server;
