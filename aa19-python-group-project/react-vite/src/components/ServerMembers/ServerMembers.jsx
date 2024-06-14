// src/components/ServerMembers/ServerMembers.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getMembersThunk, deleteMemberThunk } from "../../redux/server";
import s from "./ServerMembers.module.css";
import { FaRegTrashAlt } from "react-icons/fa";

const ServerMembers = () => {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const members = useSelector((state) => state.servers.members);

  useEffect(() => {
    dispatch(getMembersThunk(serverId));
  }, [dispatch, serverId]);

  useEffect(() => {
    console.log("Updated members:", members);
  }, [members]);

  const handleDelete = async (memberId) => {
    console.log(`Deleting member with ID: ${memberId}`);
    const response = await dispatch(deleteMemberThunk(serverId, memberId));
    console.log("Delete response:", response);
  };

  return (
    <div className={s.server_members_container}>
      <h2>Server Members</h2>
      <ul className={s.server_members}>
        {members.map((member) => (
          <li key={member.id} className={s.member_container}>
            <span>{member.username}</span>
            <button onClick={() => handleDelete(member.id)}>
              <FaRegTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerMembers;
