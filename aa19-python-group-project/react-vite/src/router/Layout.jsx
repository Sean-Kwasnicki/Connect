import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import ProfileCard from "../components/ProfileCard";
import s from "./Layout.module.css";

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkAuthenticate())
      .then(() => setIsLoaded(true))
      .then(() => {
        if (!user) {
          navigate("/login");
        }
      });
    //putting user in this array causes an infinite loop
  }, []);

  return (
    <>
      <ModalProvider>
        <div className={s.layout}>
          <Navigation />
          <ProfileCard />
          {isLoaded && <Outlet />}
          <Modal />
        </div>
      </ModalProvider>
    </>
  );
}
