
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { joinServerThunk } from "../../../redux/server";
import { useParams } from "react-router-dom";
import io from 'socket.io-client';
import s from "./ServerMemberModal.module.css";

function ServerMemberModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { serverId } = useParams();
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(joinServerThunk({ serverId, username }));
    if (response && !response.errors) {
      closeModal();
    } else {
      setErrors(response?.errors || { message: "Unknown error occurred" });
    }
  };

  return (
    <div className={s.item_container}>
      <div className={s.item}>
        <h1 className={s.header_1}>Invite People</h1>
        <form onSubmit={handleSubmit}>
          <div className={s.form_input}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {errors.username && <p>{errors.username}</p>}
          <div className={s.bottom_buttons}>
            <button
              type="button"
              onClick={closeModal}
              className={s.back_button}
            >
              Cancel
            </button>
            <button type="submit" className={s.submit_button}>
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServerMemberModal;
