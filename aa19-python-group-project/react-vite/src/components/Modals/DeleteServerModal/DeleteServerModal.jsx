import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteServerThunk } from "../../../redux/server";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../../context/Socket";
import s from "./DeleteServerModal.module.css";

function DeleteServerModal() {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteServerThunk(serverId));


    if (response === "good") {
      closeModal();
      socket.emit("delete_server", { serverId });
      navigate("/");
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <div className={s.item_container}>
      <div className={s.item}>
        <h1 className={s.header_1}>Delete Server</h1>
        <form onSubmit={handleSubmit}>
          <div className={s.form_input}>
            <label>Are you sure you want to delete this server??</label>
          </div>
          {errors.name && <p>{errors.name}</p>}
          <div className={s.bottom_buttons}>
            <button onClick={closeModal} className={s.back_button}>
              back
            </button>
            <button type="submit" className={s.submit_button}>
              Delete Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteServerModal;
