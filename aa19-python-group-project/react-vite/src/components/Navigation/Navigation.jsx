import { NavLink, useNavigate, useParams } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import s from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getServersThunk } from "../../redux/server";
import CreateServerButton from "./CreateServerButton";
import io from "socket.io-client";
import { IoIosHome } from "react-icons/io";

export const socket = io.connect("/");

function Navigation() {
  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const username = useSelector((state) => {
    if (state.session.user) {
      return state.session.user.username;
    } else {
      return null;
    }
  });

  //get servers on initial render
  useEffect(() => {
    const getServers = async () => {
      const servers = await dispatch(getServersThunk());
      setServers(servers);
      socket.emit("join", { user: username, room: -1 });
    };
    getServers();

    socket.on("create_server", (data) => {
      setServers((prevServers) => [...prevServers, data]);
    });

    socket.on("delete_server", (serverId) => {
      console.log("hit delete server emit");
      setServers((prevServers) =>
        prevServers.filter(({ id }) => {
          return id !== Number(serverId);
        })
      );
    });

    return () => {
      socket.emit("leave", { user: username, room: -1 });
      socket.off("create_server");
      socket.off("delete_server");
    };
  }, []);

  return (
    <nav className={s.nav_bar}>
      <div
        className={s.home_link}
        onClick={() => {
          navigate("/");
        }}
      >
        <IoIosHome className={s.home_icon} />
      </div>
      {servers.map(({ name, id }) => {
        const navTo = `/servers/${id}`;
        return (
          <div key={id} onClick={() => navigate(navTo)} className={s.server}>
            {name[0].toUpperCase()}
          </div>
        );
      })}
      <CreateServerButton />

      <div className={s.profile_button}>
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
