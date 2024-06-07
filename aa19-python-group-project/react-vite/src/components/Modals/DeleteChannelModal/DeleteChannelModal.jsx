import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import { useNavigate, useParams } from "react-router-dom";

function DeleteChannelModal() {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteChannelThunk(serverId, { name }));

    if (!response.errors) {
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <h1>Delete Channel</h1>
      <form onSubmit={handleSubmit}>
        <label>Are you sure you want to delete this channel?</label>
        {errors.name && <p>{errors.name}</p>}
        <button onClick={closeModal}>back</button>
        <button type="submit" onClick={() => navigate(`servers/${serverId}`)}>
          Delete Channel
        </button>
      </form>
    </>
  );
}

export default DeleteChannelModal;
