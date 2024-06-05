import { Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import { getMessagesThunk } from "../../redux/message";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import s from "./Channel.module.css";
import { createMessageThunk } from "../../redux/message";

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();

  const [content, setContent] = useState("");

  const messages = useSelector((state) => state.messages.messages);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getMessagesThunk(channelId));
  }, [dispatch, channelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createMessageThunk(channelId, { content }));
    console.log(response);
    if (response) {
      setContent("");
    }
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
