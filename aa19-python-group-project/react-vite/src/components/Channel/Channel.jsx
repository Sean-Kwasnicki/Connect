import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import s from "./Channel.module.css";
import io from "socket.io-client";
import { getMessagesThunk } from "../../redux/message";
import MessagesPage from "../Messages/MessagesPage";
import UserList from "../UserList/UserList";

const socket = io.connect("/");

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessagesThunk(channelId));
  }, [dispatch, channelId]);

  useEffect(() => {
    if (channelId) {
      socket.emit("join", { room: channelId });
    }
    return () => {
      if (channelId) {
        socket.emit("leave", { room: channelId });
      }
    };
  }, [channelId]);

  return (
    <div className={s.container}>
      <div className={s.channels}>
        {/* Channel list here */}
      </div>
      <div className={s.messages}>
        <MessagesPage channelId={channelId} />
        <Outlet /> {/* for the nested routes */}
      </div>
      <div className={s.users}>
        <UserList /> {/* Adding UserList component here */}
      </div>
    </div>
  );
};

export default Channel;
