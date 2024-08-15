import React, { useEffect, useState } from 'react';
import './DirectMessagesList.css'; 

const DirectMessageList = ({ isVisible }) => {
    const [directMessages, setDirectMessages] = useState([]);

    useEffect(() => {
        const fetchDirectMessages = async () => {
            const response = await fetch('/api/direct_messages');
            const data = await response.json();
            setDirectMessages(data.DirectMessages);
        };

        if (isVisible) {
            fetchDirectMessages();
        }
    }, [isVisible]);

    if (!isVisible) return null; // Only render if sidebar is visible

    return (
        <div className={`sidebar ${isVisible ? 'sidebar_visible' : ''}`}>
            <h3>Direct Messages</h3>
            <div className="dm_list">
                {directMessages.length > 0 ? (
                    directMessages.map(dm => (
                        <div key={dm.id} className="dm_item">
                            <img
                                src={`https://api.adorable.io/avatars/40/${dm.sender_id}.png`}
                                alt="User Avatar"
                                className="profile_icon"
                            />
                            <div className="dm_content">
                                <p>{dm.content}</p>
                                <p><small>From User ID: {dm.sender_id} to User ID: {dm.receiver_id}</small></p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No direct messages yet.</p>
                )}
            </div>
        </div>
    );
};

export default DirectMessageList;
