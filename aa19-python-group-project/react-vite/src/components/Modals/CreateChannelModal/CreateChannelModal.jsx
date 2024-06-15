import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createChannelThunk } from "../../../redux/channel";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import s from "./CreateChannelModal.module.css";

const socket = io.connect("/");

function CreateChannelModal() {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creating channel with name:", name);
    const response = await dispatch(createChannelThunk(serverId, { name }));

    console.log("Create channel response:", response);

    if (response) {
      socket.emit("channel", {
        server_id: serverId,
        channel: response,
      });
      console.log("Channel created and event emitted:", response);
      closeModal();
    } else {
      console.log("Errors:", response.errors);
      setErrors(response.errors);
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
