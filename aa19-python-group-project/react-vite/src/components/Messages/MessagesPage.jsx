import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesThunk, createMessageThunk, deleteMessageThunk, updateMessageThunk } from '../../redux/message';
import io from 'socket.io-client';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import Reaction from '../Reaction/Reaction';
import './MessagesPage.css';

const socket = io.connect('/');

const MessagesPage = ({ channelId, channelName }) => {
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.messages.messages || []);
    const currentUser = useSelector((state) => state.session.user);
    const [newMessage, setNewMessage] = useState("");
    const [editState, setEditState] = useState({ id: null, content: "" });

    useEffect(() => {
        dispatch(getMessagesThunk(channelId));
        socket.emit('join', { room: channelId });

        const onMessageReceived = () => dispatch(getMessagesThunk(channelId));
        socket.on('message', onMessageReceived);
        socket.on('delete_message', onMessageReceived);

        return () => {
            socket.off('message', onMessageReceived);
            socket.off('delete_message', onMessageReceived);
            socket.emit('leave', { room: channelId });
        };
    }, [dispatch, channelId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            await dispatch(createMessageThunk(channelId, { content: newMessage }));
            setNewMessage('');
        }
    };

    const handleDelete = async (messageId) => {
        await dispatch(deleteMessageThunk(messageId));
    };

    const handleEdit = (message) => {
        setEditState({ id: message.id, content: message.content });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        console.log("Updating message with ID:", editState.id);
        console.log("Content to update:", editState.content);
        if (editState.content.trim()) {
            await dispatch(updateMessageThunk(editState.id, { content: editState.content }));
            setEditState({ id: null, content: "" });
        }
    };

    return (
        <div className="channel-messages">
            <h1>{channelName} Channel Messages</h1>
            <ul>
                {messages.map((message) =>
                    editState.id === message.id ? (
                        <li key={message.id} className="message-item">
                            <form onSubmit={handleUpdate}>
                                <input
                                    value={editState.content}
                                    onChange={(e) => setEditState({ ...editState, content: e.target.value })}
                                    className="message-edit-input"
                                />
                                <button type="submit" className="save-button">Save</button>
                                <button onClick={() => setEditState({ id: null, content: "" })} className="cancel-button">Cancel</button>
                            </form>
                        </li>
                    ) : (
                        <li key={message.id} className="message-item">
                            <div className="message-content">
                                <span className="user-name">{message.user}</span>
                                <span className="message-text">{message.content}</span>
                                <Reaction channelId={channelId} messageId={message.id} />
                                {currentUser.username === message.user && (
                                    <div>
                                        <button onClick={() => handleEdit(message)} className="edit-button">
                                            <FaPencilAlt />
                                        </button>
                                        <button onClick={() => handleDelete(message.id)} className="delete-button">
                                            <FaRegTrashAlt />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    )
                )}
            </ul>
            <form className="message-form" onSubmit={handleSend}>
                <input
                    type='text'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="message-input"
                />
                <button type='submit' className="message-button">Send</button>
            </form>
        </div>
    );
};

export default MessagesPage;
