import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createChannelThunk } from "../../../redux/channel";
import { useParams } from "react-router-dom";
import socket from "../../../socket"; 
import s from "./CreateChannelModal.module.css";

function CreateChannelModal({ closeDropdown }) {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    const response = await dispatch(createChannelThunk(serverId, { name }));
    console.log("Channel creation response:", response);

    if (response) {
      socket.emit("channel", {
        room: `server_${serverId}`,
        channel: response,
      });
      console.log("Emitted channel creation event to socket");
      closeModal();
      console.log("Closed modal");
      if (closeDropdown) {
        closeDropdown();
        console.log("Closed dropdown");
      }
    } else {
      setErrors(response.errors);
      console.log("Error in response:", response.errors);
    }
  };

  return (
    <div className={s.item_container}>
      <div className={s.item}>
        <h1 className={s.header_1}>Create Channel</h1>
        <form onSubmit={handleSubmit}>
          <div className={s.form_input}>
            <label>Enter a name for your Channel!</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {errors.name && <p>{errors.name}</p>}
          <div className={s.bottom_buttons}>
            <button onClick={closeModal} className={s.back_button}>
              Back
            </button>
            <button type="submit" className={s.submit_button}>
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChannelModal;
