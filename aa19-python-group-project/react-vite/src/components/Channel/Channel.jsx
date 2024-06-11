import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { getMessagesThunk } from "../../redux/message";
import MessagesPage from "../Messages/MessagesPage";

const socket = io.connect("/");

const Channel = () => {
  const { channelId } = useParams();
  const { serverId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMessagesThunk(channelId));
  }, [dispatch, channelId]);

  useEffect(() => {
    if (channelId) {
      socket.emit("join", { room: channelId });

      // Listen for channel removal
      socket.on('remove_channel', (removedChannelId) => {
        if (removedChannelId === channelId) {
          navigate(`/servers/${serverId}`); // Redirect to server page or another appropriate page
        }
      });
    }
    return () => {
      if (channelId) {
        socket.emit("leave", { room: channelId });
        socket.off('remove_channel');
      }
    };
  }, [channelId, serverId, navigate]);

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
