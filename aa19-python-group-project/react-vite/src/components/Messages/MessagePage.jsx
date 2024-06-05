import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';

const MessagesPage = ({ channelId }) => {
    return (
        <div>
            <h1>Channel Messages</h1>
            <MessageForm channelId={channelId} />
            <MessageList channelId={channelId} />
        </div>
    );
};

export default MessagesPage;
