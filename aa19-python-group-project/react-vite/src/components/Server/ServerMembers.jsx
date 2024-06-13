// src/components/ServerMembers/ServerMembers.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMembersThunk, deleteMemberThunk } from '../../redux/server'
import './ServerMembers.css';

const ServerMembers = () => {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const members = useSelector((state) => state.servers.members);

  useEffect(() => {
    dispatch(getMembersThunk(serverId));
  }, [dispatch, serverId]);

  useEffect(() => {
    console.log('Updated members:', members);
  }, [members]);

  const handleDelete = async (memberId) => {
    console.log(`Deleting member with ID: ${memberId}`);
    const response = await dispatch(deleteMemberThunk(serverId, memberId));
    console.log('Delete response:', response);
  };

  return (
    <div className="server-members">
      <h2>Server Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.username}
            <button onClick={() => handleDelete(member.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerMembers;
