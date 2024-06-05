import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createServerThunk } from "../../redux/server";

function CreateServerModal({ closeMenu }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createServerThunk({ name }));

    if (response.message !== "Bad Request") {
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <h1>Create Server</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a name for your server!
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <button onClick={closeModal}>back</button>
        <button type="submit">Create Server</button>
      </form>
    </>
  );
}

export default CreateServerModal;
