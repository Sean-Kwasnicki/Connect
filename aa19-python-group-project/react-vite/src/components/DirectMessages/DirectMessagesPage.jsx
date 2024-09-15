import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDirectMessages,
  createDirectMessage,
} from "../../redux/directmessages";
import s from "./DirectMessagesPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const DirectMessagesPage = () => {
  const { userId: otherUserId } = useParams();
  const dispatch = useDispatch();
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUserName, setOtherUserName] = useState("User");
  const currentUserId = useSelector((state) => state.session.user.id);
  const messages = useSelector((state) => state.directMessages);

  useEffect(() => {
    // Fetch all messages for the current user
    dispatch(fetchDirectMessages());

    // Fetch the username of the other user
    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/users/${otherUserId}`);
        const userData = await response.json();
        setOtherUserName(userData.username);
      } catch (error) {
        return error("Failed to fetch username:", error);
      }
    };

    fetchUserName();
  }, [dispatch, otherUserId]);

  useEffect(() => {
    setNewMessage("");

    if (messages.length > 0) {
      const filtered = messages.filter(
        (msg) =>
          (msg.sender_id === currentUserId &&
            msg.receiver_id === parseInt(otherUserId)) ||
          (msg.sender_id === parseInt(otherUserId) &&
            msg.receiver_id === currentUserId)
      );

      setFilteredMessages(filtered);
    }
  }, [messages, currentUserId, otherUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Check if the message is not just whitespace
    if (newMessage.trim() === "") return;

    // Dispatch the createDirectMessage action
    dispatch(
      createDirectMessage({
        receiverId: parseInt(otherUserId),
        content: newMessage,
      })
    )
      .then((resultAction) => {
        // Check if the action was fulfilled
        if (
          resultAction.type === "directMessages/createDirectMessage/fulfilled"
        ) {
          const newMessageData = resultAction.payload;

          // Update the filtered messages with the new message
          const updatedMessages = [...filteredMessages, newMessageData];
          setFilteredMessages(updatedMessages);

          // Clear the input field after sending the message
          setNewMessage("");
        }
      })
      .catch((error) => {
        return error("Failed to create message:", error);
      });
  };

  return (
    <div className={s.channel_messages}>
      <h1 className={s.channel_label}>{otherUserName}</h1>
      <div className={s.messages_container}>
        <ul className={s.messages}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div key={msg.id} className={s.message}>
                <div className={s.message_header}>
                  <FontAwesomeIcon
                    icon={faUser}
                    className={s.profile_picture}
                  />
                  <div className={s.username}>
                    {msg.sender_id === currentUserId ? "You" : otherUserName}
                  </div>
                  <div className={s.timestamp}>
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
                <span className={s.message_text}>{msg.content}</span>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </ul>

        <div className={s.message_form}>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              className={s.message_input}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message @${otherUserName}`}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DirectMessagesPage;
