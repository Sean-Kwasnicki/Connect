import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesThunk, createMessageThunk } from '../../redux/message';
import { getReactionsThunk } from '../../redux/reaction';
import io from 'socket.io-client';
import Reaction from '../Reaction/Reaction';
import UpdateMessageModalButton from './UpdateMessageModalButton';
import { FaPencilAlt } from 'react-icons/fa';
import './MessagesPage.css';

const socket = io.connect('/');

const MessagesPage = ({ channelId, channelName }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.session.user);
    const messages = useSelector((state) => state.messages.messages || []);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getMessagesThunk(channelId));
        socket.emit('join', { room: channelId });

        socket.on('message', () => {
            dispatch(getMessagesThunk(channelId));
        });

        socket.on('delete_message', () => {
            dispatch(getMessagesThunk(channelId));
        });

        return () => {
            socket.emit('leave', { room: channelId });
            socket.off('message');
            socket.off('delete_message');
        };
    }, [dispatch, channelId]);

    useEffect(() => {
        messages.forEach(message => {
            dispatch(getReactionsThunk(channelId, message.id));
        });
    }, [dispatch, channelId, messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedMessage = `${currentUser.username}: ${message}`;
        await dispatch(createMessageThunk(channelId, { content: formattedMessage }));
        socket.emit('message', {
            message: { user: currentUser.username, content: message },
            room: channelId,
        });
        setMessage('');
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="channel-messages">
            <h1 className="channel-label">{channelName} Channel Messages</h1>
            <ul>
                {Array.isArray(messages) && messages.map(({ user, content, id, created_at }) => (
                    <li key={id} className="message-item">
                        <div className="message-header">
                            <span className="user-name">{user}</span>
                            <span className="timestamp">{created_at}</span>
                        </div>
                        <div className="message-content" onClick={() => {
                            if (currentUser.username === user) {
                                const modalButton = document.getElementById(`update-modal-trigger-${id}`);
                                if (modalButton) {
                                    modalButton.click();
                                }
                            }
                        }}>
                            <span className="message-text">{content.replace(`${user}: `, '')}</span>
                        </div>
                        <Reaction channelId={channelId} messageId={id} />
                        {currentUser.username === user && (
                            <UpdateMessageModalButton
                                messageId={id}
                                initialContent={content.replace(`${user}: `, '')}
                                initialUsername={user}
                                Component={UpdateMessageButtonComponent}
                                closeDropdown={() => {}}
                                id={`update-modal-trigger-${id}`}
                            />
                        )}
                    </li>
                ))}
            </ul>
            <form className="message-form" onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="message-input"
                />
                <button type='submit' className="message-button">Send</button>
            </form>
        </div>
    );
};

const UpdateMessageButtonComponent = ({ onClick }) => {
    return (
        <button onClick={onClick} className="edit-icon">
            <FaPencilAlt />
        </button>
    );
};

export default MessagesPage;
