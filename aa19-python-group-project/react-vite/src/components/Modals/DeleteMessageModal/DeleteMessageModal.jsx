// src/components/Modals/DeleteMessageModal/DeleteMessageModal.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteMessageThunk } from '../../../redux/message';


const DeleteMessageModal = ({ messageId, channelId, closeModal }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    await dispatch(deleteMessageThunk(messageId));
    socket.emit('delete_message', {
      message_id: messageId,
      room: channelId,
    });
    closeModal();
  };

  return (
    <div className="delete-message-modal">
      <h2>Delete Message</h2>
      <p>Are you sure you want to delete this message? This action cannot be undone.</p>
      <div className="modal-buttons">
        <button onClick={handleDelete} className="confirm-button">Delete</button>
        <button onClick={closeModal} className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
