import React, { useState } from "react";
import axios from "axios";

const MessageForm = ({ channelId }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/channels/${channelId}/messages`, { content });
      setContent("");
    } catch (error) {
      return error("Failed to send message:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;
