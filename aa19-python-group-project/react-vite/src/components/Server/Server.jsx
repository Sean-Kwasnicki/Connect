import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  getChannelsThunk,
  createChannelThunk,
  createChannel,
} from "../../redux/channel";
import { deleteServerThunk } from "../../redux/server";
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
  const navigate = useNavigate();

  const channels = useSelector((state) => state.channels.channels);
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);

  const [usersInServer, setUsersInServer] = useState([]);

  const [isSelected, setIsSelected] = useState(null);

  // Find the server name based on serverId
  const currentServer = servers.find(
    (server) => server.id === parseInt(serverId)
  );
  const serverName = currentServer ? currentServer.name : "";

  useEffect(() => {
    dispatch(getChannelsThunk(serverId));

    if (serverId && user) {
      socket.emit("join_server", { server: serverId, user: user.username });

      socket.on("update_users", (data) => {
        if (data.server === serverId) {
          setUsersInServer(data.users);
        }
      });

      return () => {
        socket.emit("leave_server", { server: serverId, user: user.username });
        socket.off("update_users");
      };
    }
  }, [dispatch, serverId, user]);

  return (
    <>
      <ul className={s.channels_container}>
        <li className={s.server_name}>{serverName}</li>
        {channels.map(({ name, id }) => {
          const navTo = `/servers/${serverId}/channels/${id}`;
          let channelClass;
          if (isSelected === id) {
            channelClass = s.channel_item_selected;
          } else {
            channelClass = s.channel_item;
          }
          return (
            <li
              key={id}
              className={channelClass}
              onClick={(e) => {
                e.preventDefault();
                navigate(navTo);
                setIsSelected(id);
                console.log(isSelected);
              }}
              to={navTo}
            >
              <span className={s.hashtag_symbol_inside_channel}>#</span>
              <span className={s.server_name_text}>{name}</span>
            </li>
            // {/* <DeleteChannelModalButton channelId={id} /> */}
          );
        })}
        <DeleteServerModalButton />
        <CreateChannelButton />
      </ul>
      {/* <div className="users">
        <h3>Users in {serverName}</h3>
        <ul>
          {usersInServer.map((username, index) => (
            <li key={index}>{username}</li>
          ))}
        </ul>
      </div> */}
      <Outlet />
    </>
  );
};

export default Server;
