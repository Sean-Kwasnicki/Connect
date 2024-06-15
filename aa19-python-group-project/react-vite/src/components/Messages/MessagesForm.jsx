import React, { useState } from 'react';

const MessageForm = ({ channelId }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, channel_id: channelId }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setContent('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageForm;
