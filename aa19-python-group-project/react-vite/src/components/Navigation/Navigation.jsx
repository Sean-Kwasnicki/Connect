import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getServersThunk } from "../../redux/server";

function Navigation() {
  const servers = useSelector((state) => state.servers.servers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getServersThunk());
  }, [dispatch]);

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {servers.map(({ name }, i) => {
        <li key={i}>{name}</li>;
      })}
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
