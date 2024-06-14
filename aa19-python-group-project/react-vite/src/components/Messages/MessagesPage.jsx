import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesThunk, createMessageThunk, deleteMessageThunk } from '../../redux/message';
import { getReactionsThunk, addReaction, addReactionThunk } from '../../redux/reaction';
import io from 'socket.io-client';
import { FaPencilAlt } from 'react-icons/fa';
import { FaRegTrashAlt } from "react-icons/fa";
import Reaction from '../Reaction/Reaction';
import './MessagesPage.css';

const socket = io.connect('/');

const MessagesPage = ({ channelId }) => {
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
        await dispatch(createMessageThunk(channelId, { content: message }));
        socket.emit('message', {
            message: { user: currentUser.username, content: message },
            room: channelId,
        });
        setMessage('');
    };

    const handleDelete = async (messageId) => {
        await dispatch(deleteMessageThunk(messageId));
        socket.emit('delete_message', {
            message_id: messageId,
            room: channelId,
        });
    };

    return (
        <div className="channel-messages">
            <h1>Channel Messages</h1>
            <ul>
                {Array.isArray(messages) && messages.map(({ user, content, id }) => (
                    <li key={id} className="message-item">
                        <div className="message-content">
                            <span className="user-name">{user}</span>
                            <span className="message-text">{content}</span>
                        </div>
                        <Reaction channelId={channelId} messageId={id} />
                        {currentUser.username === user && (
                            <button className="delete-button" onClick={() => handleDelete(id)}>
                                <FaRegTrashAlt />
                            </button>
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

export default MessagesPage;
