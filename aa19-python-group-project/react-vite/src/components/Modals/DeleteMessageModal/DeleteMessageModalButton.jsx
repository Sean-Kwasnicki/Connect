import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteMessageModal from "./DeleteMessageModal";

function DeleteMessageModalButton({ messageId, Component, closeDropdown }) {
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
      itemText="Delete Message"
      onItemClick={closeMenu}
      modalComponent={
        <DeleteMessageModal messageId={messageId} onClose={closeMenu} />
      }
      Component={Component}
    />
  );
}

export default DeleteMessageModalButton;
