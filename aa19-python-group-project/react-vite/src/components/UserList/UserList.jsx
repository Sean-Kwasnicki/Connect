import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/users";
import { NavLink } from "react-router-dom";

const UserList = ({ className }) => {
    const dispatch = useDispatch();
    const { users, status } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    if (status === "loading") {
        return <div className={className}>Loading...</div>;
    }

    if (status === "failed") {
        return <div className={className}>Error loading users.</div>;
    }

    return (
        <div className={className}>
            <h2>Users</h2>
            <ul>
                {Array.isArray(users) && users.map((user) => (
                    <li key={user.id}>
                        <NavLink to={`/users/${user.id}`}>{user.username}</NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
