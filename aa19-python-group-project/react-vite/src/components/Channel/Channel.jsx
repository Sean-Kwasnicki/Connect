import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./Channel.module.css";
import io from "socket.io-client";
import { getMessagesThunk, createMessageThunk } from "../../redux/message";

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
      console.log("Received message via WebSocket:", data);
      dispatch(getMessagesThunk(channelId));
    });

    return () => {
      socket.off("message");
    };
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

  const sendMessage = async () => {
    if (message && channelId) {
      const response = await dispatch(createMessageThunk(channelId, { content: message }));
      if (response) {
        socket.emit("message", {
          message: { user: user.username, content: message },
          room: channelId,
        });
        setMessage("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      <ul className={s.channels}>
        {Array.isArray(messages) && messages.map(({ user, content, id }) => (
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
      <Outlet /> {/* for the nested routes */}
    </>
  );
};

export default Channel;


// Below is the commented-out code for reference
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
