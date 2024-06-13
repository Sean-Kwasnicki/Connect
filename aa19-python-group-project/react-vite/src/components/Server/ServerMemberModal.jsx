import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { joinServerThunk } from "../../redux/server";
import { useParams } from "react-router-dom";

function ServerMemberModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { serverId } = useParams();
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(joinServerThunk({ serverId, username }));

    if (!response.errors) {
      closeModal();
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <h1>Invite People</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <button type="button" onClick={closeModal}>Cancel</button>
        <button type="submit">Invite</button>
      </form>
    </>
  );
}

export default ServerMemberModal;
