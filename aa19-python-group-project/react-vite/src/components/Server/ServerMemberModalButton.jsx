import { useState, useEffect } from "react";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ServerMemberModal from "./ServerMemberModal";

function ServerMemberButton({ Component }) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

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
