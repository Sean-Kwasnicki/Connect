import { useState, useEffect } from "react";
import OpenModalMenuItem from "./OpenModalMenuItem";
import CreateServerModal from "./CreateServerModal";
import s from "../Navigation/Navigation.module.css";

function CreateServerModalButton() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  return (
    <div onClick={toggleMenu} className={s.create_server_button}>
      <OpenModalMenuItem
        itemText="+"
        onItemClick={closeMenu}
        modalComponent={<CreateServerModal />}
        style={{
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </div>
  );
}

export default CreateServerModalButton;
