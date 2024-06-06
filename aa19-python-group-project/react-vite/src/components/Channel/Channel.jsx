import { Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import { getMessagesThunk } from "../../redux/message";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import s from "./Channel.module.css";
import { createChannelThunk } from "../../redux/channel";
import io from "socket.io-client";

const socket = io.connect("/");

const Channel = () => {
  const { channelId, serverId } = useParams();
  const dispatch = useDispatch();

  // const [messages, setMessages] = useState([]);
  // const [content, setContent] = useState("");

  // const user = useSelector((state) => state.session.user);
  // // http://localhost:5173/servers/1/channels/1
  // const socket = io.connect("/");

  // // const socket = io();
  // useEffect(() => {
  //   socket.on("create_message", (message) => {
  //     console.log("\n\n\n\n\n\n");
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });
  //   // return () => {
  //   //   socket.disconnect();
  //   // };
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const messages = await dispatch(getMessagesThunk(channelId));
      if (messages) {
        setMessages(messages);
        console.log(messages);
      }
    };
    fetchData();
  }, [dispatch, channelId]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const response = await dispatch(createMessageThunk(channelId, { content }));
  //   console.log(response);
  //   if (response) {
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       { content, id: user.id, user: user.username },
  //     ]);
  //   } else {
  //     console.log("bad")
  //   }

  //   socket.emit("send_message", { content, id: user.id, user: user.username });
  // };

  const user = useSelector((state) => state.session.user);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    joinRoom();
    return leaveRoom;
  });

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

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

  const sendMessage = () => {
    if (message && channelId) {
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
        {messages.map(({ user, content, id }) => {
          return (
            <li key={id} className={s.message}>
              <span>{user}</span>
              <p>{content}</p>
            </li>
          );
        })}
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              e.preventDefault();
              setMessage(e.target.value);
            }}
          />
        </label>
        <button type="submit">send message</button>
      </form>
      <Outlet />
    </>
  );
};

export default Channel;
