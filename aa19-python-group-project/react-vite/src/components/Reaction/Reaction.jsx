import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addReactionThunk, removeReactionThunk, getReactionsThunk, addReaction, removeReaction } from '../../redux/reaction';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
import './Reaction.css';
import { FaSmile } from 'react-icons/fa';


// const socket = io.connect('/');

const Reaction = ({ channelId, messageId }) => {
  const dispatch = useDispatch();
  const reactions = useSelector((state) =>
    state.reactions.reactionsByMessageId[messageId] || []
  );
  const user = useSelector((state) => state.session.user);
  const [Reactions, setReactions] = useState(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    dispatch(getReactionsThunk(channelId, messageId));

    // socket.emit('join', { room: `channel_${channelId}` });

    const handleNewReaction = (reaction) => {
      if (reaction.message_id === messageId && !Reactions.has(reaction.id)) {
        dispatch(addReaction(reaction));
      }
    };

    const handleRemoveReaction = ({ reactionId, messageId: msgId }) => {
      if (msgId === messageId) {
        dispatch(removeReaction(reactionId, msgId));
      }
    };

    // socket.on('new_reaction', handleNewReaction);
    // socket.on('remove_reaction', handleRemoveReaction);

    // return () => {
    //   socket.emit('leave', { room: `channel_${channelId}` });
    //   socket.off('new_reaction', handleNewReaction);
    //   socket.off('remove_reaction', handleRemoveReaction);
    // };
  }, [dispatch, channelId, messageId, Reactions]);

  const handleAddReaction = async (emoji) => {
    const newReaction = await dispatch(addReactionThunk(channelId, messageId, emoji));
    if (newReaction) {
      setReactions((prev) => new Set(prev).add(newReaction.id));
      // socket.emit('reaction', {
      //   room: `channel_${channelId}`,
      //   reaction: newReaction,
      // });
    }
  };

  const handleRemoveReaction = async (reactionId) => {
    await dispatch(removeReactionThunk(channelId, messageId, reactionId));
    setReactions((prev) => {
      const updated = new Set(prev);
      updated.delete(reactionId);
      return updated;
    });
    // socket.emit('reaction', {
    //   room: `channel_${channelId}`,
    //   reaction: { remove: true, reactionId, messageId },
    // });
  };

  const handleEmojiClick = (emojiObject) => {
    handleAddReaction(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});

  const handleEmojiIconClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="reaction-container">
      <button onClick={handleEmojiIconClick} className="emoji-picker-button">
      <FaSmile className="icon" />
        </button>
      {showEmojiPicker && (
        <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark"/>
      )}
      <div className="reaction-counts">
        {Object.keys(reactionCounts).map((emoji) => (
          <span key={emoji} onClick={() => {
            const reaction = reactions.find(r => r.emoji === emoji && r.user_id === user.id);
            if (reaction) handleRemoveReaction(reaction.id);
          }}>
            {emoji} {reactionCounts[emoji] || 0}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Reaction;
