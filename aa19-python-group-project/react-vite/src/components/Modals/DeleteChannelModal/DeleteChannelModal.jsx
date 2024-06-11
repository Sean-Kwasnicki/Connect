import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import { useNavigate, useParams } from "react-router-dom";

function DeleteChannelModal() {
  const navigate = useNavigate();
  const { serverId, channelId } = useParams(); // Make sure to get channelId if required
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteChannelThunk(serverId, channelId));

    if (!response.errors) {
      closeModal();
      navigate(`/servers/${serverId}`); // Navigate to server page after deletion
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <h1>Delete Channel</h1>
      <form onSubmit={handleSubmit}>
        <label>Are you sure you want to delete this channel?</label>
        {errors.message && <p>{errors.message}</p>}
        <button type="button" onClick={closeModal}>Back</button>
        <button type="submit">Delete Channel</button>
      </form>
    </>
  );
}

export default DeleteChannelModal;
