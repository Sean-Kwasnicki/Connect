import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import s from "./Channel.module.css";
import DeleteChannelModalButton from "../Modals/DeleteChannelModal";
import io from "socket.io-client";
import s from "./Channel.module.css";

const socket = io.connect("/");

const Channel = () => {
  const { channelId, serverId } = useParams();
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
      <Outlet /> {/* for the nested routes */}
    </>
  );
};

export default Channel;




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
        <DeleteChannelModalButton />
      </form>
      <Outlet />
    </>
  );
};

export default Channel;
