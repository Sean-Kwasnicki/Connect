// src/Layout.jsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import s from "./Layout.module.css";

export default function Layout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    if (!user && isLoaded) {
      navigate("/login");
    }
  }, [user, isLoaded, navigate]);

  return (
    <>
      <ModalProvider>
        <div className={s.layout}>
          <Navigation className={s.navigation} />
          <div className={s.content}>
            {isLoaded && <Outlet />}
          </div>
          <Modal />
        </div>
      </ModalProvider>
    </>
  );
}
