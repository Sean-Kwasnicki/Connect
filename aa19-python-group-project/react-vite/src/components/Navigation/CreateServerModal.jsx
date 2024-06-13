import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createServerThunk } from "../../redux/server";
import { socket } from "./Navigation";
import s from "./CreateServerModal.module.css";

function CreateServerModal() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createServerThunk({ name }));
    console.log();
    console.log(response);
    if (response.message !== "Bad Request") {
      socket.emit("create_server", { room: -1, server: response });
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <div className={s.item_container}>
      <div className={s.item}>
        <h1 className={s.header_1}>Create Server</h1>
        <form onSubmit={handleSubmit}>
          <div className={s.form_input}>
            <label>Enter a name for your server!</label>
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
              Create Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateServerModal;
