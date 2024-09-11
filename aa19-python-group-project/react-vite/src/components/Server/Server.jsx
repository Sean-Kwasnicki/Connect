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
  deleteChannel,
} from "../../redux/channel";
import { deleteServerThunk } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import s from "./Server.module.css";
import CreateChannelButton from "../Modals/CreateChannelModal/CreateChannelModalButton";
import DeleteServerModalButton from "../Modals/DeleteServerModal/DeleteServerModalButton";
import DeleteChannelModalButton from "../Modals/DeleteChannelModal/DeleteChannelModalButton";
import ServerMemberButton from "../Modals/ServerMemberModal";
import ServerMembers from "../ServerMembers";
import UpdateChannelButton from "../Modals/UpdateChannelModal/UpdateChannelButton";
import socket from "../../context/Socket";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaCirclePlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import UpdateServerModalButton from "../Modals/UpdateServerModal/UpdateServerModalButton";
import { PiNotePencil } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";
import ServerDropdownMenu from "./ServerDropdownMenu";
import ChannelDropdownMenu from "./ChannelDropdownMenu";

const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const channels = useSelector((state) => state.channels[serverId] || []);
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);

  const [usersInServer, setUsersInServer] = useState([]);
  const [channelIsSelected, setChannelIsSelected] = useState(null);

  const currentServer = servers.find(
    (server) => server.id === parseInt(serverId)
  );
  const serverName = currentServer ? currentServer.name : "";

  useEffect(() => {
    dispatch(getChannelsThunk(serverId));

  }, [dispatch, serverId, user]);

  return (
    <>
      <ul className={s.channels_container}>
        <li className={s.server_bar}>
          <span className={s.server_name}>{serverName}</span>
          {user && user.id === currentServer.owner_id && (
            <ServerDropdownMenu serverId={serverId} channels={channels} />
          )}
        </li>
        {channels.map(({ name, id }) => {
          const navTo = `/servers/${serverId}/channels/${id}`;
          let channelClass;
          if (channelIsSelected === id) {
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
                setChannelIsSelected(id);
              }}
              to={navTo}
            >
              <div>
                <span className={s.hashtag_symbol_inside_channel}>#</span>
                <span className={s.channel_name_text}>{name}</span>
              </div>
              <ChannelDropdownMenu
                serverId={serverId}
                channelId={id}
                serverChannels={channels}
              />
            </li>
          );
        })}
      </ul>
      <div className={s.right_container}>
        <div className={s.messages_page_sizing_container}>
          <Outlet />
        </div>
        <ServerMembers usersInServer={usersInServer} />
      </div>
    </>
  );
};

export default Server;
