import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteServerModal from "./DeleteServerModal";

function DeleteServerModalButton({ Component }) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  return (
    <OpenModalMenuItem
      itemText="Delete Server"
      onItemClick={closeMenu}
      modalComponent={<DeleteServerModal />}
      Component={Component}
    />
  );
}

export default DeleteServerModalButton;
