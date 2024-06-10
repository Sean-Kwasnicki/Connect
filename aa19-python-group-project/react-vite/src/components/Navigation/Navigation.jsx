import { NavLink, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import s from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getServersThunk } from "../../redux/server";
import CreateServerButton from "./CreateServerButton";
import { IoIosHome } from "react-icons/io";

function Navigation() {
  const servers = useSelector((state) => state.servers.servers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getServersThunk());
  }, [dispatch]);

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
