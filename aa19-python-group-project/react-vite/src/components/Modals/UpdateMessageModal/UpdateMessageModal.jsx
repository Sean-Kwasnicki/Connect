import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMessageThunk } from '../../../redux/message';
import s from './UpdateMessageModal.module.css'; 

function UpdateMessageModal({ messageId, originalContent, onClose }) {
    const [newContent, setNewContent] = useState(originalContent);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (newContent.trim() === "") {
            setErrors({ content: "Content cannot be empty." });
            return;
        }

        const response = await dispatch(updateMessageThunk(messageId, { content: newContent }));
        if (!response.error) {
            onClose();
        } else {
            setErrors({ content: response.error.message });
        }
    };

    return (
        <div className={s.modalBackground} onClick={onClose}>
            <div className={s.modalContent} onClick={e => e.stopPropagation()}>
                <h2>Update Message</h2>
                <form onSubmit={handleUpdate}>
                    <label>New Content:</label>
                    <input
                        type="text"
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                        required
                    />
                    {errors.content && <p className={s.error}>{errors.content}</p>}
                    <button type="submit">Update</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateMessageModal;
