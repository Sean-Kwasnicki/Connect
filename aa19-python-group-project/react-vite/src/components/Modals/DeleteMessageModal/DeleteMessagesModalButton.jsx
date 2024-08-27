import React from 'react';
import { useModal } from '../../../context/Modal';
import DeleteMessageModal from './DeleteMessageModal';

const DeleteMessageModalButton = ({ messageId, channelId, Component }) => {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    openModal(() => (
      <DeleteMessageModal
        messageId={messageId}
        channelId={channelId}
        closeModal={closeModal}
      />
    ));
  };

  return (
    <button onClick={handleOpenModal} className="delete-button">
      <Component />
    </button>
  );
};

export default DeleteMessageModalButton;
