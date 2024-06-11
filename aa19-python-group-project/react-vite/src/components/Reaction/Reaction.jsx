import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addReactionThunk, removeReactionThunk, getReactionsThunk, addReaction, removeReaction } from '../../redux/reaction';
import io from 'socket.io-client';

const socket = io.connect('/');

const Reaction = ({ channelId, messageId }) => {
  const dispatch = useDispatch();
  const reactions = useSelector((state) =>
    state.reactions.reactionsByMessageId[messageId] || []
  );
  const user = useSelector((state) => state.session.user);
  const [Reactions, setReactions] = useState(new Set());

  useEffect(() => {
    dispatch(getReactionsThunk(channelId, messageId));

    socket.emit('join', { room: `channel_${channelId}` });

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

    socket.on('new_reaction', handleNewReaction);
    socket.on('remove_reaction', handleRemoveReaction);

    return () => {
      socket.emit('leave', { room: `channel_${channelId}` });
      socket.off('new_reaction', handleNewReaction);
      socket.off('remove_reaction', handleRemoveReaction);
    };
  }, [dispatch, channelId, messageId, Reactions]);

  const handleAddReaction = async (emoji) => {
    const newReaction = await dispatch(addReactionThunk(channelId, messageId, emoji));
    if (newReaction) {
      setReactions((prev) => new Set(prev).add(newReaction.id));
      socket.emit('reaction', {
        room: `channel_${channelId}`,
        reaction: newReaction,
      });
    }
  };

  const handleRemoveReaction = async (reactionId) => {
    await dispatch(removeReactionThunk(channelId, messageId, reactionId));
    setReactions((prev) => {
      const updated = new Set(prev);
      updated.delete(reactionId);
      return updated;
    });
    socket.emit('reaction', {
      room: `channel_${channelId}`,
      reaction: { remove: true, reactionId, messageId },
    });
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
            {reactions.filter(reaction => reaction.emoji === emoji && reaction.user_id === user.id).map(reaction => (
              <button key={reaction.id} onClick={() => handleRemoveReaction(reaction.id)}>Remove</button>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Reaction;
