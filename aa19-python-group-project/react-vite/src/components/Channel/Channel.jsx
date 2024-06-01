import { Outlet, useParams } from "react-router-dom";
import { getMessagesThunk } from "../../redux/message";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import s from "./Channel.module.css";

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.messages.messages);

  useEffect(() => {
    dispatch(getMessagesThunk(channelId));
  }, [dispatch, channelId]);

  console.log(messages)

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
      <Outlet />
    </>
  );
};

export default Channel;
