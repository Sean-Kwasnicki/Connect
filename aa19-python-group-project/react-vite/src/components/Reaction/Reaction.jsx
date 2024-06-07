import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReactionsThunk } from '../redux/reaction';
import socket from '../socket';
import ReactionForm from './ReactionForm';

const Reaction = ({ messageId }) => {
  const dispatch = useDispatch();
  const reactions = useSelector(state => state.reactions.filter(reaction => reaction.message_id === messageId));

  useEffect(() => {
    dispatch(getReactionsThunk(messageId));

    // Set up socket listeners for new and removed reactions
    socket.on('new_reaction', (reaction) => {
      if (reaction.message_id === messageId) {
        dispatch({ type: 'ADD_REACTION', payload: reaction });
      }
    });

    socket.on('remove_reaction', (data) => {
      if (data.message_id === messageId) {
        dispatch({ type: 'REMOVE_REACTION', payload: data.emoji });
      }
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off('new_reaction');
      socket.off('remove_reaction');
    };
  }, [dispatch, messageId]);

  const handleAddReaction = (emoji) => {
    socket.emit('add_reaction', { emoji, message_id: messageId });
  };

  const handleRemoveReaction = (emoji) => {
    socket.emit('remove_reaction', { emoji, message_id: messageId });
  };

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="reactions">
      <ReactionForm onAddReaction={handleAddReaction} />
      {['👍', '👎', '❤️'].map(emoji => (
        <span key={emoji} onClick={() => handleRemoveReaction(emoji)}>
          {emoji} {reactionCounts[emoji] || 0}
        </span>
      ))}
    </div>
  );
};

export default Reaction;
