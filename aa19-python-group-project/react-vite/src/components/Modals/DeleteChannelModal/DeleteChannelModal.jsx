import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import s from "./DeleteChannelModal.module.css";

function DeleteChannelModal({ serverChannels, serverId }) {
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    const channel = serverChannels.find(channel => channel.name === inputValue);

    if (channel) {
      const response = await dispatch(deleteChannelThunk(channel.id));
      if (!response.errors) {
        closeModal();
      } else {
        setErrors(response.errors);
      }
    } else {
      setErrors({ name: "Channel name does not match." });
    }
  };

  return (
    <div className={s.modalBackdrop} onClick={closeModal}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Delete Channel</h2>
        <form onSubmit={handleDelete}>
          <p>Type the name of the channel to confirm deletion:</p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={s.input}
          />
          {errors.name && <p className={s.error}>{errors.name}</p>}
          <button type="submit" className={s.deleteButton}>Delete</button>
          <button type="button" onClick={closeModal} className={s.cancelButton}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default DeleteChannelModal;
