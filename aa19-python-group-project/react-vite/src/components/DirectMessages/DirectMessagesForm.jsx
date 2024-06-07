import React, { useState } from 'react';
import axios from 'axios';

const DirectMessageForm = () => {
    const [content, setContent] = useState('');
    const [receiverId, setReceiverId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/direct_messages', { content, receiver_id: receiverId });
        setContent('');
        setReceiverId('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <input
                type="number"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                placeholder="Receiver ID"
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default DirectMessageForm;
