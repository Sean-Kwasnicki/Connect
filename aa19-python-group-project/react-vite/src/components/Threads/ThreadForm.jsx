
import React from 'react';
import axios from 'axios';

const ThreadForm = ({ messageId }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/threads', { message_id: messageId });
    };

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Create Thread</button>
        </form>
    );
};

export default ThreadForm;
