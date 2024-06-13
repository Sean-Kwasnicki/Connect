import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './EmojiPickerButton.css';

const EmojiPickerButton = ({ onEmojiClick }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiIconClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    onEmojiClick(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="emoji-picker-container">
      <div className="emoji-picker-icon" onClick={handleEmojiIconClick}>
        😊
      </div>
      {showEmojiPicker && (
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      )}
    </div>
  );
};

export default EmojiPickerButton;
