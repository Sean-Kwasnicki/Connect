import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createChannelThunk } from "../../../redux/channel";
import { useParams } from "react-router-dom";

function CreateChannelModal() {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createChannelThunk(serverId, { name }));

    if (!response.errors) {
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <h1>Create Channel</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a name for your Channel!
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        {errors.name && <p>{errors.name}</p>}
        <button onClick={closeModal}>back</button>
        <button type="submit">Create Channel</button>
      </form>
    </>
  );
}

export default CreateChannelModal;
