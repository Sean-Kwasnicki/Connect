import React from 'react';
import ThreadList from './ThreadList';
import ThreadForm from './ThreadForm';

const ThreadsPage = ({ messageId }) => {
    return (
        <div>
            <h1>Threads</h1>
            <ThreadForm messageId={messageId} />
            <ThreadList messageId={messageId} />
        </div>
    );
};

export default ThreadsPage;
