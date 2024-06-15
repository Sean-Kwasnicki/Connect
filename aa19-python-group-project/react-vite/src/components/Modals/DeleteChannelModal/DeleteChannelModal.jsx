import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import { socket } from "../../Navigation/Navigation";
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
      console.log("Delete response:", response);
      if (!response.errors) {
        socket.emit('delete_channel', { server: serverId, channel_id: channel.id });
        closeModal();
      } else {
        setErrors(response.errors);
      }
    } else {
      setErrors({ name: "Channel name does not match." });
    }
  };

  return (
    <div className={s.item_container} onClick={closeModal}>
      <div className={s.item} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.header_1}>Delete Channel</h2>
        <form onSubmit={handleDelete}>
          <div className={s.form_input}>
            <label>Type the name of the channel to confirm deletion:</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={s.input}
              required
            />
          </div>
          {errors.name && <p className={s.error}>{errors.name}</p>}
          <div className={s.bottom_buttons}>
            <button type="button" onClick={closeModal} className={s.back_button}>Cancel</button>
            <button type="submit" className={s.submit_button}>Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteChannelModal;
