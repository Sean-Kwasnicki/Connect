import React, { useState } from 'react';
import axios from 'axios';

const MessageForm = ({ channelId }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/messages', { content, channel_id: channelId });
        setContent('');
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
