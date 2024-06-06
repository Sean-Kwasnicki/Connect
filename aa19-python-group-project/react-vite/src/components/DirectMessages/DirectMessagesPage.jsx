import React from 'react';
import DirectMessageList from './DirectMessageList';
import DirectMessageForm from './DirectMessageForm';

const DirectMessagesPage = () => {
    return (
        <div>
            <h1>Direct Messages</h1>
            <DirectMessageForm />
            <DirectMessageList />
        </div>
    );
};

export default DirectMessagesPage;
