import { NavLink, useNavigate, useParams } from "react-router-dom";
import s from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  getServersThunk,
  createServer,
  updateServer,
  deleteServer,
} from "../../redux/server";
import CreateServerButton from "./CreateServerButton";
import { IoIosHome } from "react-icons/io";
import socket from "../../context/Socket";
import DirectMessageList from "../DirectMessages/DirectMessagesList";

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

  const [isSidebarVisible, setSidebarVisible] = useState(false)

  //get servers on initial render
  useEffect(() => {
    //grab servers from api and update store
    dispatch(getServersThunk());
    //join room -1 that is for server updates
    // socket.emit("join", { user: username, room: -1 });

    // socket.on("create_server", (data) => {
    //   //update store with new server
    //   console.log(data, user);
    //   if (data.public === true || (user && user.id === data.owner_id)) {
    //     dispatch(createServer(data));
    //   }
    // });

    // socket.on("update_server", (payload) => {
    //   console.log("update server hit!");
    //   console.log(payload);
    //   dispatch(updateServer(payload.server, payload.serverId));
    // });

    // socket.on("delete_server", (serverId) => {
    //   dispatch(deleteServer(serverId));
    // });

    // return () => {
    //   socket.emit("leave", { user: username, room: -1 });
    //   socket.off("create_server");
    //   socket.off("update_server");
    //   socket.off("delete_server");
    // };
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    navigate("/")
  };

  return (
    <nav className={s.nav_bar}>
      <div
        className={s.home_link}
        onClick={toggleSidebar} // Toggle sidebar and navigate on home icon click
        // onClick={() => {
        //   navigate("/");
        // }}
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
      <DirectMessageList isVisible={isSidebarVisible} /> {/* Sidebar component */}
    </nav>
  );
}

export default Navigation;
