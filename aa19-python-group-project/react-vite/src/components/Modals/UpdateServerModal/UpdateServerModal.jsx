import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateServerThunk } from "../../../redux/server";
import { useParams } from "react-router-dom";
import socket from "../../../context/Socket";
import s from "./UpdateServerModal.module.css";

function UpdateServerModal() {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      updateServerThunk(serverId, { name, public: isPublic })
    );

    if (response) {
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <div className={s.item_container}>
      <div className={s.item}>
        <h1 className={s.header_1}>Update Server</h1>
        <form onSubmit={handleSubmit}>
          <div className={s.form_input}>
            <label>Server Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {errors.name && <p className={s.errors}>{errors.name}</p>}
          <div className={s.radio_options}>
            <label>
              Public
              <input
                type="radio"
                name="isPublic"
                checked={isPublic === true}
                onChange={() => setIsPublic(true)}
              />
            </label>
            <label>
              Private
              <input
                type="radio"
                name="isPublic"
                checked={isPublic === false}
                onChange={() => setIsPublic(false)}
              />
            </label>
          </div>
          <div className={s.bottom_buttons}>
            <button onClick={closeModal} className={s.back_button}>
              Back
            </button>
            <button type="submit" className={s.submit_button}>
              Update Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateServerModal;
