import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import UpdateServerModal from "./UpdateServerModal";

function UpdateServerModalButton({ Component, closeDropdown }) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => {
    setShowMenu(false);
    if (closeDropdown) closeDropdown();
  };

  return (
    <OpenModalMenuItem
      itemText="Update Server"
      onItemClick={closeMenu}
      modalComponent={<UpdateServerModal />}
      Component={Component}
    />
  );
}

export default UpdateServerModalButton;
