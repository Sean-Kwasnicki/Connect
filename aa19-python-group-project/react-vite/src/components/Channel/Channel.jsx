import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagesThunk, createMessageThunk } from "../../redux/message";
import io from "socket.io-client";
import s from "./Channel.module.css";

const socket = io.connect("/");

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const messages = useSelector((state) => state.messages.messages);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getMessagesThunk(channelId));
  }, [dispatch, channelId]);

  useEffect(() => {
    socket.on("message", (data) => {
      dispatch(getMessagesThunk(channelId));
    });

    return () => {
      socket.off("message");
    };
  }, [dispatch, channelId]);

  const joinRoom = () => {
    if (channelId) {
      socket.emit("join", { room: channelId });
    }
  };

  const leaveRoom = () => {
    if (channelId) {
      socket.emit("leave", { room: channelId });
    }
  };

  useEffect(() => {
    joinRoom();
    return leaveRoom;
  }, [channelId]);

  const sendMessage = async () => {
    if (message && channelId) {
      await dispatch(createMessageThunk(channelId, { content: message }));
      socket.emit("message", {
        message: { user: user.username, content: message },
        room: channelId,
      });
      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      <ul className={s.channels}>
        {messages.map(({ user, content, id }) => (
          <li key={id} className={s.message}>
            <span>{user}</span>
            <p>{content}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">Send Message</button>
      </form>
      <Outlet />
    </>
  );
};

export default Channel;
