import { useState } from 'react';
import UpdateMessageModal from './UpdateMessageModal'; 

function UpdateMessageModalButton({ messageId, originalContent }) {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <>
            <button onClick={openModal}>Update Message</button>
            {showModal && (
                <UpdateMessageModal
                    messageId={messageId}
                    originalContent={originalContent}
                    onClose={closeModal}
                />
            )}
        </>
    );
}

export default UpdateMessageModalButton;
