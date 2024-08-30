import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import UpdateChannelModal from "./UpdateChannelModal";

function UpdateChannelModalButton({
  serverId,
  channelId,
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
      itemText="Update Channel"
      onItemClick={closeMenu}
      modalComponent={
        <UpdateChannelModal
          serverId={serverId}
          channelId={channelId}
          onClose={closeMenu}
        />
      }
      Component={Component}
    />
  );
}

export default UpdateChannelModalButton;
