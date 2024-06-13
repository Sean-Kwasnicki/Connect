import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import ServerMemberModal from "./ServerMemberModal";

function ServerMemberButton({ Component, closeDropdown }) {
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
      itemText="Invite People"
      onItemClick={closeMenu}
      modalComponent={<ServerMemberModal />}
      Component={Component}
    />
  );
}

export default ServerMemberButton;
