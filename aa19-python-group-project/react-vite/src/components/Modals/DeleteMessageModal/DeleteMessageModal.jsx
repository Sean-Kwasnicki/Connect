import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteMessageThunk } from "../../../redux/message";
import s from "./DeleteMessageModal.module.css";
import socket from "../../../context/Socket";

function DeleteMessageModal({ messageId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteMessageThunk(messageId));
    closeModal();
  };

  return (
    <div className={s.item_container} onClick={closeModal}>
      <div className={s.item} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.header_1}>Delete Message</h2>
        <form onSubmit={handleDelete}>
          <div className={s.bottom_buttons}>
            <button
              type="button"
              onClick={closeModal}
              className={s.back_button}
            >
              Back
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

export default DeleteMessageModal;
