import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { getMessagesThunk } from "../../redux/message";
import MessagesPage from "../Messages/MessagesPage";
import { createChannel, deleteChannel } from "../../redux/channel";

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

      socket.on("new_channel", (channel) => {
        dispatch(createChannel(channel));
      });

      socket.on("remove_channel", (channelId) => {
        dispatch(deleteChannel(channelId));
      });

      return () => {
        socket.emit("leave", { room: channelId });
        socket.off("new_channel");
        socket.off("remove_channel");
      };
    }
  }, [channelId, dispatch]);

  return (
    <>
      <MessagesPage channelId={channelId} />
      <Outlet /> {/* for the nested routes */}
    </>
  );
};

export default Channel;
