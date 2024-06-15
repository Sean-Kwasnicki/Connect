import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DirectMessageList = () => {
    const [directMessages, setDirectMessages] = useState([]);

    useEffect(() => {
        const fetchDirectMessages = async () => {
            const response = await axios.get('/api/direct_messages');
            setDirectMessages(response.data.DirectMessages);
        };

        fetchDirectMessages();
    }, []);

    return (
        <div>
            {directMessages.map(dm => (
                <div key={dm.id}>
                    <p>{dm.content}</p>
                    <p><small>From User ID: {dm.sender_id} to User ID: {dm.receiver_id}</small></p>
                </div>
            ))}
        </div>
    );
};

export default DirectMessageList;
