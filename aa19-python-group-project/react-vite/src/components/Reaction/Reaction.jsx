// src/components/Reaction/Reaction.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addReactionThunk, removeReactionThunk, getReactionsThunk } from '../../redux/reaction';
import io from 'socket.io-client';

const socket = io.connect('/');

const Reaction = ({ channelId, messageId }) => {
  const dispatch = useDispatch();
  const reactions = useSelector((state) =>
    state.reactions.reactionsByMessageId[messageId] || []
  );
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getReactionsThunk(channelId, messageId));

    socket.on('chat', (data) => {
      const { action, data: eventData } = data;
      if (action === 'reaction' && eventData.messageId === messageId) {
        dispatch(getReactionsThunk(channelId, messageId)); // Fetch updated reactions
      }
    });

    return () => {
      socket.off('chat');
    };
  }, [dispatch, channelId, messageId]);

  const handleAddReaction = (emoji) => {
    dispatch(addReactionThunk(channelId, messageId, emoji)).then((newReaction) => {
      socket.emit('chat', {
        room: channelId,
        action: 'reaction',
        data: { reaction: newReaction }
      });
    });
  };

  const handleRemoveReaction = (reactionId) => {
    dispatch(removeReactionThunk(channelId, messageId, reactionId)).then(() => {
      socket.emit('chat', {
        room: channelId,
        action: 'reaction',
        data: { remove: true, reactionId, messageId }
      });
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
