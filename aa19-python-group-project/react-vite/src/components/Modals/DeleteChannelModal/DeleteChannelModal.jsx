import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io.connect("/");

function DeleteChannelModal({ channelId }) {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteChannelThunk(channelId));

    if (response) {
      console.log('Emitting delete_channel event with data:', { serverId, channelId });
      socket.emit('delete_channel', {
        serverId,
        channelId,
        room: `server_${serverId}`
      });
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
