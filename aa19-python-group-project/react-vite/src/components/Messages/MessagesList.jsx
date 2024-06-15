import React, { useEffect, useState } from 'react';

const MessageList = ({ channelId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`/api/channels/${channelId}/messages`);
            if (response.ok) {
                const data = await response.json();  
                setMessages(data.messages);         
            } else {
                console.error("Failed to fetch messages:", response.statusText);
            }
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
