import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./EmojiPickerButton.css";
import { FaSmile } from "react-icons/fa";

const EmojiPickerButton = ({ onEmojiClick }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiIconClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    onEmojiClick(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="emoji-picker-icon" onClick={handleEmojiIconClick}>
      <FaSmile />
      <div className="emoji-picker-container">
        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
      </div>
    </div>
  );
};

export default EmojiPickerButton;
