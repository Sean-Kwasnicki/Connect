import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import CreateChannelModal from "./CreateChannelModal";

function CreateChannelModalButton({ Component, closeDropdown }) {
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
      itemText="Create Channel"
      onItemClick={closeMenu}
      modalComponent={<CreateChannelModal />}
      Component={Component}
    />
  );
}

export default CreateChannelModalButton;
