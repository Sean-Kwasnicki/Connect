import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteChannelThunk } from "../../../redux/channel";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

// Initialize socket
const socket = io.connect("/");

function DeleteChannelModal({ channelId }) {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDeleteChannel = async () => {
    const response = await dispatch(deleteChannelThunk(channelId));

    if (response === "good") {
      console.log(`Emitting remove_channel event for channelId ${channelId}`);
      // Emit the event to the server
      socket.emit('channel', {
        room: `server_${serverId}`,
        channel: { remove: true, channelId },
      });
      closeModal();
      navigate(`/servers/${serverId}`);
    } else {
      console.log('Error deleting channel:', response.errors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Attempting to delete channel with ID: ${channelId}`);
    handleDeleteChannel();
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
