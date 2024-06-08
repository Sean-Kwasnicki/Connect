import React from 'react';

const ReactionForm = ({ onAddReaction }) => {
  return (
    <div className="reaction-form">
      {['👍', '👎', '❤️'].map(emoji => (
        <span key={emoji} onClick={() => onAddReaction(emoji)}>
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default ReactionForm;
