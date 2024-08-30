import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDirectMessages, createDirectMessage } from '../../redux/directmessages';
import './DirectMessagesPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const DirectMessagesPage = () => {
    const { userId: otherUserId } = useParams();
    const dispatch = useDispatch();
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [otherUserName, setOtherUserName] = useState('User');
    const currentUserId = useSelector(state => state.session.user.id);
    const messages = useSelector(state => state.directMessages);

    useEffect(() => {
        console.log('currentUserId:', currentUserId);
        console.log('otherUserId:', otherUserId);

        // Fetch all messages for the current user
        dispatch(fetchDirectMessages());

        // Fetch the username of the other user
        const fetchUserName = async () => {
            try {
                const response = await fetch(`/api/users/${otherUserId}`);
                const userData = await response.json();
                setOtherUserName(userData.username);
            } catch (error) {
                console.error('Failed to fetch username:', error);
            }
        };

        fetchUserName();
    }, [dispatch, otherUserId]);

    useEffect(() => {
        setNewMessage('');

        if (messages.length > 0) {
            console.log("Messages available for filtering:", messages);

            const filtered = messages.filter(
                (msg) =>
                    (msg.sender_id === currentUserId && msg.receiver_id === parseInt(otherUserId)) ||
                    (msg.sender_id === parseInt(otherUserId) && msg.receiver_id === currentUserId)
            );

            setFilteredMessages(filtered);
            console.log("Filtered Messages:", filtered);
        }
    }, [messages, currentUserId, otherUserId]);

    const handleSendMessage = () => {
      // Check if the message is not just whitespace
      if (newMessage.trim() === '') return;

      console.log('Sending message to user:', parseInt(otherUserId), 'with content:', newMessage);

      // Dispatch the createDirectMessage action
      dispatch(createDirectMessage({ receiverId: parseInt(otherUserId), content: newMessage }))
          .then((resultAction) => {
              // Check if the action was fulfilled
              if (resultAction.type === 'directMessages/createDirectMessage/fulfilled') {
                  const newMessageData = resultAction.payload;

                  // Update the filtered messages with the new message
                  const updatedMessages = [...filteredMessages, newMessageData];
                  setFilteredMessages(updatedMessages);
                  console.log('Updated Filtered Messages:', updatedMessages);

                  // Clear the input field after sending the message
                  setNewMessage('');
              }
          })
          .catch((error) => {
              console.error('Failed to create message:', error);
          });
  };


    return (
        <div className="dm_page">
            <h3 className="channel-label">Conversation with {otherUserName}</h3>
            <div className="messages_list">
                {filteredMessages.length > 0 ? (
                    filteredMessages.map((msg) => (
                        <div key={msg.id} className="message_item">
                            <div className="message-header">
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className="profile_icon"
                                    style={{ fontSize: '24px', marginRight: '10px' }}
                                />
                                <span className="user-name">{msg.sender_id === currentUserId ? 'You' : otherUserName}</span>
                                <span className="timestamp">{new Date(msg.created_at).toLocaleString()}</span>
                            </div>
                            <div className="message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>
            <div className="send_message">
                <input
                    type="text"
                    className="message-input"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button className="message-button" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default DirectMessagesPage;
