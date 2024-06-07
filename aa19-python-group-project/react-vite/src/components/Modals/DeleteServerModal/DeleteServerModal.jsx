import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteServerThunk } from "../../../redux/server";
import { useNavigate, useParams } from "react-router-dom";

function DeleteServerModal() {
  const navigate = useNavigate();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(deleteServerThunk(serverId));

    if (!response.errors) {
      closeModal();
      navigate("/");
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <>
      <h1>Delete Server</h1>
      <form onSubmit={handleSubmit}>
        <label>Are you sure you want to delete this server??</label>
        {errors.name && <p>{errors.name}</p>}
        <button onClick={closeModal}>back</button>
        <button type="submit">Delete Server</button>
      </form>
    </>
  );
}

export default DeleteServerModal;
