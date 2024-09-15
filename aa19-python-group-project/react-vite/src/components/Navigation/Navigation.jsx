import { NavLink, useNavigate, useParams } from "react-router-dom";
import s from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getServersThunk } from "../../redux/server";
import CreateServerButton from "./CreateServerButton";
import { IoIosHome } from "react-icons/io";
import socket from "../../context/Socket";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const servers = useSelector((state) => state.servers.servers);
  const username = useSelector((state) => {
    if (state.session.user) {
      return state.session.user.username;
    } else {
      return null;
    }
  });

  const user = useSelector((state) => state.session.user);

  //get servers on initial render
  useEffect(() => {
    //grab servers from api and update store
    dispatch(getServersThunk());
  }, [dispatch]);

  return (
    <nav className={s.nav_bar}>
      <div
        className={s.home_link}
        onClick={(e) => {
          e.preventDefault();
          navigate("/direct_messages");
        }}
      >
        <IoIosHome className={s.home_icon} />
      </div>
      {servers &&
        servers.map(({ name, id }) => {
          const navTo = `/servers/${id}`;
          return (
            <div
              key={id}
              onClick={(e) => {
                navigate(navTo);
              }}
              className={s.server}
              onContextMenu={(e) => e.preventDefault()}
            >
              {name[0].toUpperCase()}
            </div>
          );
        })}
      <CreateServerButton />

      <a
        className={s.about_link}
        href="https://github.com/Sean-Kwasnicki/Connect"
      >
        About
      </a>
    </nav>
  );
}

export default Navigation;
