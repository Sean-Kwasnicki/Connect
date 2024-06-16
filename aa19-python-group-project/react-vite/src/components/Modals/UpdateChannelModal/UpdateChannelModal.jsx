import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateChannelThunk } from "../../../redux/channel";
import s from "./UpdateChannelModal.module.css";

function UpdateChannelModal({ serverChannels, onClose }) {
  const [channelName, setChannelName] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  useEffect(() => {
    if (!serverChannels) {
      console.error("serverChannels is undefined");
    }
  }, [serverChannels]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!serverChannels) {
      setErrors({ name: "Server channels data is missing." });
      return;
    }

    const channel = serverChannels.find(channel => channel.name === channelName);

    if (channel) {
      const response = await dispatch(updateChannelThunk(channel.id, { name: newChannelName }));
      if (!response.errors) {
        closeModal();
        onClose();
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
        <h2 className={s.header_1}>Update Channel</h2>
        <form onSubmit={handleUpdate}>
          <div className={s.form_input}>
            <label>Current Channel Name:</label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className={s.input}
              required
            />
          </div>
          <div className={s.form_input}>
            <label>New Channel Name:</label>
            <input
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              className={s.input}
              required
            />
          </div>
          {errors.name && <p className={s.error}>{errors.name}</p>}
          <div className={s.bottom_buttons}>
            <button type="button" onClick={closeModal} className={s.back_button}>Cancel</button>
            <button type="submit" className={s.submit_button}>Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateChannelModal;
