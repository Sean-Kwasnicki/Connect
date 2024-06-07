import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ThreadList = ({ messageId }) => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        const fetchThreads = async () => {
            const response = await axios.get(`/api/threads/${messageId}`);
            setThreads(response.data.Threads);
        };

        fetchThreads();
    }, [messageId]);

    return (
        <div>
            {threads.map(thread => (
                <div key={thread.id}>
                    <p>Thread ID: {thread.id}</p>
                </div>
            ))}
        </div>
    );
};

export default ThreadList;
