import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import s from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getServersThunk } from "../../redux/server";
import CreateServerButton from "./CreateServerButton";
import io from "socket.io-client";

// Connect to the SocketIO server
const socket = io.connect("/");

function Navigation() {
  const servers = useSelector((state) => state.servers.servers);
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getServersThunk());
  }, [dispatch]);

  return (
    <ul className={s.nav_bar}>
      <li className={s.home_link}>
        <NavLink to="/">Home</NavLink>
      </li>
      <li className={s.profile_button}>
        <ProfileButton />
      </li>
      {servers.map(({ name, id }) => {
        const navTo = `/servers/${id}`;
        return (
          <NavLink
            key={id}
            to={navTo}
            className={s.server}
            onClick={() => {
              if (user) {
                socket.emit('join', { server: id, user: user.username });  // Was previously 'room'
              }
            }}
          >
            {name}
          </NavLink>
        );
      })}
      <CreateServerButton />
    </ul>
  );
}

export default Navigation;
