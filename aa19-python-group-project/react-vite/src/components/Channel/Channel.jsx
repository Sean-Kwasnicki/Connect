import { Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import s from "./Channel.module.css";
import io from "socket.io-client";
import { getMessagesThunk, createMessageThunk } from "../../redux/message";
import Reaction from "../Reaction/Reaction";
import MessagesPage from "../Messages/MessagesPage";


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
    <>
      <MessagesPage channelId={channelId} />
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