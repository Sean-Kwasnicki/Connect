
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMembersThunk, deleteMemberThunk } from '../../redux/server';
import io from 'socket.io-client';
import s from './ServerMembers.module.css'
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

    socket.on('update_users', (data) => {
      if (data.server === serverId) {
        dispatch(getMembersThunk(serverId));
      }
    });

    return () => {
      socket.emit('leave', { room: serverId });
      socket.off('update_users');
    };
  }, [dispatch, serverId]);

  const handleDelete = async (memberId) => {

    const response = await dispatch(deleteMemberThunk(serverId, memberId));

    if (response) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        socket.emit('leave_server', { server: serverId, user: member.username });
      }
    }
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
