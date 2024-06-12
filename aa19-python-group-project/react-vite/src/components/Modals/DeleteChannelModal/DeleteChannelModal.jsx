import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../Navigation/Navigation";

function DeleteChannelModal({ channelId, onClose }) {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteChannelThunk(channelId));

    if (!response.errors) {
      closeModal();
      socket.emit("delete_channel", { serverId, channelId });
      navigate(`/servers/${serverId}`);
      onClose();
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
        <button onClick={() => { closeModal(); onClose(); }}>Back</button>
        <button type="submit">Delete Channel</button>
      </form>
    </>
  );
}

export default DeleteChannelModal;
