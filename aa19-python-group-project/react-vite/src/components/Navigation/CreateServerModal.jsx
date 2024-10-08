import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createServerThunk } from "../../redux/server";
import s from "./CreateServerModal.module.css";
import socket from "../../context/Socket";

function CreateServerModal() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      createServerThunk({ name, public: isPublic })
    );
    if (response.message !== "Bad Request") {
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  useEffect(() => {
  }, [isPublic]);

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
              Create Server
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateServerModal;
