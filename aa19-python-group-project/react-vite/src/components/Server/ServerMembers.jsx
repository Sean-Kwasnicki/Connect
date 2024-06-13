// src/components/ServerMembers/ServerMembers.js
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMembersThunk } from '../../redux/server';
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

  return (
    <div className="server-members">
      <h2>Server Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServerMembers;
