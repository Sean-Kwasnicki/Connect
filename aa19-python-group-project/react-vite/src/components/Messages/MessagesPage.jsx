
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesThunk, createMessageThunk } from '../../redux/message';
import { getReactionsThunk } from '../../redux/reaction';
import io from 'socket.io-client';
import Reaction from '../Reaction/Reaction';

const socket = io.connect('/');

const MessagesPage = ({ channelId }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const messages = useSelector((state) => state.messages.messages || []);
    const [message, setMessage] = useState("");

    useEffect(() => {
        dispatch(getMessagesThunk(channelId));
        socket.emit('join', { room: channelId });

        socket.on('message', (data) => {
            dispatch(getMessagesThunk(channelId));
        });

        return () => {
            socket.emit('leave', { room: channelId });
            socket.off('message');
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
            message: { user: user.username, content: message },
            room: channelId,
        });
        setMessage(''); // Clear the input field
    };

    return (
        <div>
            <h1>Channel Messages</h1>
            <ul>
                {Array.isArray(messages) && messages.map(({ user, content, id }) => (
                    <li key={id}>
                        <span>{user}</span>: {content}
                        <Reaction channelId={channelId} messageId={id} /> {/* Use the Reaction component here */}
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    );
};

export default MessagesPage;
