import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessageList = ({ channelId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await axios.get(`/api/messages/${channelId}/all`);
            setMessages(response.data.messages);
        };

        fetchMessages();
    }, [channelId]);

    return (
        <div>
            {messages.map(message => (
                <div key={message.id}>
                    <p>{message.content}</p>
                    <p><small>By User ID: {message.user_id}</small></p>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
