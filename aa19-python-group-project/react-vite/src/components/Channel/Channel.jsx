import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagesThunk } from "../../redux/message";
import MessagesPage from "../Messages/MessagesPage";
import {
  getChannelsThunk,
  createChannel,
  deleteChannel,
} from "../../redux/channel";
import socket from "../../context/Socket";

const Channel = () => {
  const { serverId } = useParams();
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels[serverId] || []);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    dispatch(getMessagesThunk(channelId));
  }, [dispatch, channelId]);

  useEffect(() => {
    if (channelId && channels.length > 0) {
      const channel = channels.find((ch) => ch.id === parseInt(channelId, 10));
      if (channel) {
        setChannelName(channel.name);
      }
    }
  }, [channels, channelId]);

  return (
    <>
      <MessagesPage channelId={channelId} channelName={channelName} />
      <Outlet />
    </>
  );
};

export default Channel;
