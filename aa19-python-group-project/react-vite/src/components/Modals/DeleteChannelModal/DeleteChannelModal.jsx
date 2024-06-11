import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import { useNavigate, useParams } from "react-router-dom";


function DeleteChannelModal({ channelId }) {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteChannelThunk(channelId));

    if (response) {
      closeModal();
      navigate(`/servers/${serverId}`);
    }
  };

  return (
    <>
      <h1>Delete Channel</h1>
      <form onSubmit={handleSubmit}>
        <label>Are you sure you want to delete this channel?</label>
        <button onClick={closeModal}>Back</button>
        <button type="submit">Delete Channel</button>
      </form>
    </>
  );
}

export default DeleteChannelModal;
