import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteChannelModal from "./DeleteChannelModal";

function DeleteChannelModalButton({
  serverChannels,
  serverId,
  Component,
  closeDropdown,
}) {
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
      itemText="Delete Channel"
      onItemClick={closeMenu}
      modalComponent={
        <DeleteChannelModal
          serverChannels={serverChannels}
          serverId={serverId}
          onClose={closeMenu}
        />
      }
      Component={Component}
    />
  );
}

export default DeleteChannelModalButton;
