import { Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import { getMessagesThunk } from "../../redux/message";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import s from "./Channel.module.css";
import { createMessageThunk } from "../../redux/message";
import io from "socket.io-client";

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  const user = useSelector((state) => state.session.user.id);
  // http://localhost:5173/servers/1/channels/1
  const socket = io.connect("/");

  // const socket = io();
  useEffect(() => {
    socket.on("create_message", (message) => {
      console.log("\n\n\n\n\n\n");
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createMessageThunk(channelId, { content }));
    console.log(response);
    if (response) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content, id: user.id, user: user.username },
      ]);
    } else {
      console.log("bad")
    }

    socket.emit("send_message", { content, id: user.id, user: user.username });
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
            value={content}
            onChange={(e) => {
              e.preventDefault();
              setContent(e.target.value);
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
