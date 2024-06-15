import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMessageThunk, deleteMessageThunk } from '../../redux/message';
import { useModal } from '../../context/Modal';

const UpdateMessageModal = ({ messageId, initialContent, onClose }) => {
    const [content, setContent] = useState(initialContent);
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.session.user);
    const { closeModal } = useModal();
    const [errors, setErrors] = useState({});

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedContent = `${content}`;
        const response = await dispatch(updateMessageThunk(messageId, { content: updatedContent }));
        if (response && response.errors) {
            setErrors(response.errors);
        } else {
            closeModal();
            onClose();
        }
    };

    const handleDelete = async () => {
        await dispatch(deleteMessageThunk(messageId));
        closeModal();
        onClose();
    };

    return (
        <div className="update-message-modal">
            <h1>Update Message</h1>
            <form onSubmit={handleUpdate}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                {errors.content && <p>{errors.content}</p>}
                <div>
                    <button type="button" onClick={closeModal}>Cancel</button>
                    <button type="submit">Update</button>
                    <button type="button" onClick={handleDelete}>Delete</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateMessageModal;
