import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addReactionThunk,
  removeReactionThunk,
  getReactionsThunk,
  removeReaction,
} from "../../redux/reaction";
import io from "socket.io-client";
import "./Reaction.css";

// const socket = io.connect('/');

const Reaction = ({ channelId, messageId }) => {
  const dispatch = useDispatch();
  const reactions = useSelector(
    (state) => state.reactions.reactionsByMessageId[messageId] || []
  );
  const user = useSelector((state) => state.session.user);
  const [Reactions, setReactions] = useState(new Set());

  useEffect(() => {
    dispatch(getReactionsThunk(channelId, messageId));

    // socket.emit('join', { room: `channel_${channelId}` });
  }, [dispatch, channelId, messageId, Reactions]);

  const handleAddReaction = async (emoji) => {
    const newReaction = await dispatch(
      addReactionThunk(channelId, messageId, emoji)
    );
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

  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="reaction-container">
      <div className="reaction-counts">
        {Object.keys(reactionCounts).map((emoji) => (
          <span
            className="emoji-count"
            key={emoji}
            onClick={() => {
              const reaction = reactions.find(
                (r) => r.emoji === emoji && r.user_id === user.id
              );
              if (reaction) handleRemoveReaction(reaction.id);
            }}
          >
            {emoji} {reactionCounts[emoji] || 0}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Reaction;
