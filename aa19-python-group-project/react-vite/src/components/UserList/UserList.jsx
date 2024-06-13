import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/users";
import { NavLink } from "react-router-dom";
import s from "./UserList.module.css";
import io from "socket.io-client";

const socket = io.connect("/");

const UserList = () => {
    const dispatch = useDispatch();
    const [usersInServer, setUsersInServer] = useState([]);
    const user = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(fetchUsers());

        socket.on('update_users', (data) => {
            setUsersInServer(data.users);
        });

        return () => {
            socket.off('update_users');
        };
    }, [dispatch]);

    return (
        <div className={s.userList}>
            <h2>Users</h2>
            <ul>
                {usersInServer.map((username, index) => (
                    <li key={index}>
                        <NavLink to={`/users/${username}`}>{username}</NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
