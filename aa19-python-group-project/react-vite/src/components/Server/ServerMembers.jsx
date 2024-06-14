// src/components/ServerMembers/ServerMembers.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMembersThunk, deleteMemberThunk } from '../../redux/server';
import io from 'socket.io-client';
import './ServerMembers.css';
import { FaRegTrashAlt } from "react-icons/fa";

const socket = io.connect('/');

const ServerMembers = () => {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const members = useSelector((state) => state.servers.members);

  useEffect(() => {
    dispatch(getMembersThunk(serverId));
  }, [dispatch, serverId]);

  useEffect(() => {
    socket.emit('join', { room: serverId });
    console.log(`Emitting join event for room: ${serverId}`);

    socket.on('update_users', (data) => {
      console.log(`Received update_users event with data: ${JSON.stringify(data)}`);
      if (data.server === serverId) {
        dispatch(getMembersThunk(serverId));
      }
    });

    return () => {
      socket.emit('leave', { room: serverId });
      console.log(`Emitting leave event for room: ${serverId}`);
      socket.off('update_users');
    };
  }, [dispatch, serverId]);

  const handleDelete = async (memberId) => {

    const response = await dispatch(deleteMemberThunk(serverId, memberId));

    if (response) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        console.log(`Emitting leave_server event with server: ${serverId}, user: ${member.username}`);
        socket.emit('leave_server', { server: serverId, user: member.username });
      }
    }
  };

  return (
    <div className="server-members">
      <h2>Server Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.username}
            <button className='member_delete' onClick={() => handleDelete(member.id)}><FaRegTrashAlt /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerMembers;
