import { NavLink, Outlet, useParams } from "react-router-dom";
import { getChannelsThunk } from "../../redux/channel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import s from "./Server.module.css";
import CreateChannelButton from "../Modals/CreateChannelModal/CreateChannelModalButton";
import DeleteServerModalButton from "../Modals/DeleteServerModal/DeleteServerModalButton";
import DeleteChannelModalButton from "../Modals/DeleteChannelModal/DeleteChannelModalButton";
import io from "socket.io-client";

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

    if (serverId && user) {
      socket.emit('join_server', { server: serverId, user: user.username });

      socket.on('update_users', (data) => {
        if (data.server === serverId) {
          setUsersInServer(data.users);
        }
      });

      return () => {
        socket.emit('leave_server', { server: serverId, user: user.username });
        socket.off('update_users');
      };
    }
  }, [dispatch, serverId, user]);

  return (
    <>
      <ul className={s.channels}>
        {channels.map(({ name, id }) => {
          const navTo = `/servers/${serverId}/channels/${id}`;
          return (
            <li key={id} className={`${s.serverItem} channel`}>
              <NavLink key={id} to={navTo} className={s.server}>
                {name}
              </NavLink>
              <DeleteChannelModalButton channelId={id} serverId={serverId} />
            </li>
          );
        })}
        <DeleteServerModalButton />
        <CreateChannelButton />
      </ul>
      <div className={s.users}>
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
