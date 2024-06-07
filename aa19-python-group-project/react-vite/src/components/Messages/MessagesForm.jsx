import axios from 'axios';
import React, { useState, useEffect } from 'react';

const MessageForm = ({ serverId, channelId }) => {
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    console.log('serverId:', serverId);
    console.log('channelId:', channelId);
    console.log('Type of serverId:', typeof serverId);
    console.log('Type of channelId:', typeof channelId);
  }, [serverId, channelId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!serverId || typeof channelId !== 'number') {
      console.error('Server ID or Channel ID is invalid');
      return;
    }
    try {
      const response = await axios.post(`/api/servers/${serverId}/channels/${channelId}/messages`, {
        content: messageContent,
      });
      console.log('Message submitted successfully:', response.data);
      setMessageContent('');
    } catch (error) {
      console.error('Failed to create message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;
