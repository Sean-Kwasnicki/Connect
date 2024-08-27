import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import s from "./DeleteChannelModal.module.css";
import socket from "../../../context/Socket";

function DeleteChannelModal({ serverChannels, serverId }) {
  const [channelName, setChannelName] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    const channel = serverChannels.find(
      (channel) => channel.name === channelName
    );

    if (channel) {
      const response = await dispatch(deleteChannelThunk(serverId, channel.id));
      if (response === "good") {
        closeModal();
        // socket.emit("delete_channel", {
        //   server: Number(serverId),
        //   channel_id: channel.id,
        // });
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
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className={s.input}
              required
            />
          </div>
          {errors.name && <p className={s.error}>{errors.name}</p>}
          <div className={s.bottom_buttons}>
            <button
              type="button"
              onClick={closeModal}
              className={s.back_button}
            >
              Cancel
            </button>
            <button type="submit" className={s.submit_button}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteChannelModal;
