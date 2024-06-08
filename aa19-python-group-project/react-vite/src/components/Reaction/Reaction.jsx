// src/components/Reaction.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReactionsThunk, addReactionThunk, removeReactionThunk } from '../../redux/reaction'

const Reaction = ({ channelId, messageId }) => {
  const dispatch = useDispatch();
  const reactions = useSelector((state) => state.reactions.reactions.filter((reaction) => reaction.message_id === messageId));

  useEffect(() => {
    dispatch(getReactionsThunk(channelId, messageId));
  }, [dispatch, channelId, messageId]);

  const handleAddReaction = (emoji) => {
    dispatch(addReactionThunk(channelId, messageId, emoji));
  };

  const handleRemoveReaction = (reactionId) => {
    dispatch(removeReactionThunk(channelId, messageId, reactionId));
  };

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="reactions">
      <button onClick={() => handleAddReaction('👍')}>👍</button>
      <button onClick={() => handleAddReaction('👎')}>👎</button>
      <button onClick={() => handleAddReaction('❤️')}>❤️</button>
      <div className="reaction-counts">
        {['👍', '👎', '❤️'].map((emoji) => (
          <span key={emoji}>
            {emoji} {reactionCounts[emoji] || 0}
            {reactions.filter(reaction => reaction.emoji === emoji).map(reaction => (
              <button key={reaction.id} onClick={() => handleRemoveReaction(reaction.id)}>Remove</button>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Reaction;
