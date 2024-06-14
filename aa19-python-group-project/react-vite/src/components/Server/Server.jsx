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
import ServerMemberButton from "../Modals/ServerMemberModal";
import ServerMembers from "../ServerMembers";
import io from "socket.io-client";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaCirclePlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

const socket = io.connect("/");

const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const channels = useSelector((state) => state.channels.channels);
  const user = useSelector((state) => state.session.user);
  const servers = useSelector((state) => state.servers.servers);

  const [usersInServer, setUsersInServer] = useState([]);

  const [channelIsSelected, setChannelIsSelected] = useState(null);
  const [downArrowIsSelected, setDownArrowIsSelected] = useState(false);

  const closeDropdown = () => setDownArrowIsSelected(false);

  useEffect(() => {}, [downArrowIsSelected]);

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
        <li className={s.server_bar}>
          <span className={s.server_name}>{serverName}</span>
          <span
            className={s.arrow}
            onClick={() => {
              setDownArrowIsSelected((prev) => !prev);
            }}
          >
            {!downArrowIsSelected && <IoIosArrowDown />}
            {downArrowIsSelected && <RxCross2 />}
          </span>
        </li>
        <li
          className={s.server_menu_container}
          style={{
            display: downArrowIsSelected ? "" : "none",
          }}
        >
          <CreateChannelButton
            Component={CreateChannelButtonComponent}
            closeDropdown={closeDropdown}
          />
          <DeleteChannelModalButton
            serverChannels={channels}
            serverId={serverId}
            Component={DeleteChannelButtonComponent}
            closeDropdown={closeDropdown}
          />
          <ServerMemberButton
            Component={ServerMemberButtonComponent}
            closeDropdown={closeDropdown}
          />
          <DeleteServerModalButton
            Component={DeleteServerButtonComponent}
            closeDropdown={closeDropdown}
          />
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
              <span className={s.hashtag_symbol_inside_channel}>#</span>
              <span className={s.channel_name_text}>{name}</span>
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

const CreateChannelButtonComponent = () => {
  return (
    <div className={s.create_channel_button}>
      <span>Create Channel</span>
      <FaCirclePlus className={s.create_channel_plus_symbol} />
    </div>
  );
};

const DeleteChannelButtonComponent = () => {
  return (
    <div className={s.create_channel_button}>
      <span>Delete Channel</span>
      <FaRegTrashAlt className={s.create_channel_plus_symbol} />
    </div>
  );
};

const DeleteServerButtonComponent = () => {
  return (
    <div className={s.create_channel_button}>
      <span>Delete Server</span>
      <FaRegTrashAlt className={s.create_channel_plus_symbol} />
    </div>
  );
};

const ServerMemberButtonComponent = () => {
  return (
    <div className={s.create_channel_button}>
      <span>Invite People</span>
      <FaCirclePlus className={s.create_channel_plus_symbol} />
    </div>
  );
};

export default Server;
