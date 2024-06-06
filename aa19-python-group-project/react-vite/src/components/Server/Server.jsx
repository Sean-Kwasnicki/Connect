import { NavLink, Outlet, useParams } from "react-router-dom";
import { getChannelsThunk } from "../../redux/channel";
import { deleteServerThunk } from "../../redux/server";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import s from "./Server.module.css";

const Server = () => {
  const { serverId } = useParams("serverId");
  const dispatch = useDispatch();

  const channels = useSelector((state) => state.channels.channels);

  useEffect(() => {
    dispatch(getChannelsThunk(serverId));
  }, [dispatch, serverId]);

  return (
    <>
      <ul className={s.channels}>
        {channels.map(({ name, id }) => {
          const navTo = `/servers/${serverId}/channels/${id}`;
          return (
            <li key={id}>
              <NavLink key={id} to={navTo} className={s.server}>
                {name}
              </NavLink>
            </li>
          );
        })}
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(deleteServerThunk(serverId));
          }}
        >Delete Server!</button>
      </ul>
      <Outlet />
    </>
  );
};

export default Server;
