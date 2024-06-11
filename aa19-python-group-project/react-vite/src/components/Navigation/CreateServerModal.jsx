import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createServerThunk } from "../../redux/server";
import { socket } from "./Navigation";

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
