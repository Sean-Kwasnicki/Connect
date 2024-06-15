import { useState, useEffect } from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import UpdateMessageModal from "./UpdateMessageModal";
import { FaPencilAlt } from 'react-icons/fa';

function UpdateMessageModalButton({ messageId, initialContent, initialUsername, Component, closeDropdown }) {
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
      itemText={<FaPencilAlt />}
      onItemClick={closeMenu}
      modalComponent={<UpdateMessageModal messageId={messageId} initialContent={initialContent} initialUsername={initialUsername} onClose={closeMenu} />}
      Component={Component}
      className="update-button"
    />
  );
}

export default UpdateMessageModalButton;
