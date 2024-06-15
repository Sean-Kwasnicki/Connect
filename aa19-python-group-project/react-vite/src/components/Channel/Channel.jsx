import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { getMessagesThunk } from "../../redux/message";
import MessagesPage from "../Messages/MessagesPage";
import { getChannelsThunk, createChannel, deleteChannel } from "../../redux/channel";

const socket = io.connect("/");

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels.channels);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    dispatch(getMessagesThunk(channelId));
    dispatch(getChannelsThunk()); 
  }, [dispatch, channelId]);

  useEffect(() => {
    if (channelId && channels.length > 0) {
      const channel = channels.find((ch) => ch.id === parseInt(channelId, 10));
      if (channel) {
        setChannelName(channel.name);
      }
    }
  }, [channels, channelId]);

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
      <MessagesPage channelId={channelId} channelName={channelName} />
      <Outlet />
    </>
  );
};

export default Channel;

