import React, { useEffect, useState } from 'react';
import './DirectMessagesList.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const DirectMessageList = ({ isVisible }) => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isVisible) {
            const fetchUsers = async () => {
                const response = await fetch('/api/direct_messages/users');
                const data = await response.json();
                setUsers(data);
            };
            fetchUsers();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const handleUserClick = (userId) => {
        navigate(`/direct_messages/${userId}`);
    };

    return (
        <div className={`sidebar ${isVisible ? 'sidebar_visible' : ''}`}>
            <h3>Direct Messages</h3>
            <div className="dm_list">
                {users.length > 0 ? (
                    users.map(user => (
                        <div key={user.id} className="dm_item" onClick={() => handleUserClick(user.id)}>
                        <FontAwesomeIcon
                            icon={faUser}
                            className="profile_icon"
                            style={{ fontSize: '24px', marginRight: '10px' }}
                        />
                            <div className="dm_content">
                                <p>{user.username}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No other users found.</p>
                )}
            </div>
        </div>
    );
};

export default DirectMessageList;
