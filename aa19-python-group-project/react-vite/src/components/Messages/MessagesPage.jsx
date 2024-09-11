import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessagesThunk,
  createMessageThunk,
  deleteMessageThunk,
} from "../../redux/message";
import {
  getReactionsThunk,
  addReaction,
  addReactionThunk,
} from "../../redux/reaction";
import io from "socket.io-client";
import { FaPencilAlt } from "react-icons/fa";
import { FaRegTrashAlt, FaSpinner } from "react-icons/fa";
import Reaction from "../Reaction/Reaction";
import DeleteMessageModal from "../Modals/DeleteMessageModal";
import s from "./MessagesPage.module.css";
import EmojiPickerButton from "../Reaction/EmojiPickerButton";

const socket = io.connect("/");

const MessagesPage = ({ channelId, channelName }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const messages = useSelector((state) => state.messages.messages || []);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const onEmojiClick = ({ emoji }) => {
    const response = dispatch(addReactionThunk(channelId, messageId, emoji));
    if (response) {
      showEmojiPicker(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(getMessagesThunk(channelId));
      setLoading(false);
    };

    fetchData();

    socket.on("message", () => {
      dispatch(getMessagesThunk(channelId));
    });

    socket.emit("join", { room: channelId });

    socket.on("delete_message", () => {
      dispatch(getMessagesThunk(channelId));
    });

    return () => {
      socket.off("message");
      socket.emit("leave", { room: channelId });
      socket.off("delete_message");
    };
  }, [dispatch, channelId]);

  useEffect(() => {
    messages.forEach((message) => {
      dispatch(getReactionsThunk(channelId, message.id));
    });
  }, [dispatch, channelId, messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createMessageThunk(channelId, { content: message }));
    socket.emit("message", {
      message: { user: currentUser.username, content: message },
      room: channelId,
    });
    setMessage("");
  };

  return (
    <div className={s.channel_messages}>
      <h1 className={s.channel_label}>{channelName} Channel Messages</h1>
      {loading ? (
        <div className={s.loading_spinner}>
          <FaSpinner className={s.spinner_icon} />
          <p className={s.loading_text}>Loading Messages...</p>
        </div>
      ) : (
        <>
          <ul className={s.messages_container}>
            {Array.isArray(messages) &&
              messages.map(({ user, content, id }) => (
                <li key={id} className={s.message_item}>
                  <div className={s.message_content}>
                    <div className={s.message_content_header}>
                      <span className={s.username}>{user}</span>
                      <div className={s.message_buttons}>
                        <EmojiPickerButton
                          channelId={channelId}
                          messageId={id}
                          onEmojiClick={(emoji) => {
                            dispatch(addReactionThunk(channelId, id, emoji));
                          }}
                        />
                        {currentUser.username === user && (
                          <DeleteMessageModal
                            messageId={id}
                            Component={DeleteChannelModalComponent}
                          />
                        )}
                      </div>
                    </div>
                    <span className={s.message_text}>{content}</span>
                    <Reaction channelId={channelId} messageId={id} />
                  </div>
                </li>
              ))}
          </ul>
          <form className={s.message_form} onSubmit={handleSubmit}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={s.message_input}
            />
            <button type="submit" className="message-button">
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};

const DeleteChannelModalComponent = () => {
  return (
    <div className="delete-message-modal-button">
      <FaRegTrashAlt />
    </div>
  );
};

export default MessagesPage;
