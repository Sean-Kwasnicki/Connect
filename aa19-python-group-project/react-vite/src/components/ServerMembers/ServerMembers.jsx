// src/components/ServerMembers/ServerMembers.js
<<<<<<< HEAD:aa19-python-group-project/react-vite/src/components/ServerMembers/ServerMembers.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getMembersThunk, deleteMemberThunk } from "../../redux/server";
import s from "./ServerMembers.module.css";
=======
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMembersThunk, deleteMemberThunk } from '../../redux/server';
import io from 'socket.io-client';
import './ServerMembers.css';
>>>>>>> Dev4Test:aa19-python-group-project/react-vite/src/components/Server/ServerMembers.jsx
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
<<<<<<< HEAD:aa19-python-group-project/react-vite/src/components/ServerMembers/ServerMembers.jsx
    console.log("Updated members:", members);
  }, [members]);
=======
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
>>>>>>> Dev4Test:aa19-python-group-project/react-vite/src/components/Server/ServerMembers.jsx

  const handleDelete = async (memberId) => {

    const response = await dispatch(deleteMemberThunk(serverId, memberId));
<<<<<<< HEAD:aa19-python-group-project/react-vite/src/components/ServerMembers/ServerMembers.jsx
    console.log("Delete response:", response);
=======

    if (response) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        console.log(`Emitting leave_server event with server: ${serverId}, user: ${member.username}`);
        socket.emit('leave_server', { server: serverId, user: member.username });
      }
    }
>>>>>>> Dev4Test:aa19-python-group-project/react-vite/src/components/Server/ServerMembers.jsx
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
