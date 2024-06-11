import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteChannelModal from "./DeleteChannelModal";

function DeleteChannelModalButton({ channelId, serverId }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => setShowMenu(false);
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  return (
    <button onClick={toggleMenu}>
      <OpenModalMenuItem
        itemText="Delete Channel"
        onItemClick={() => setShowMenu(false)}
        modalComponent={<DeleteChannelModal channelId={channelId} serverId={serverId} />}
      />
    </button>
  );
}

export default DeleteChannelModalButton;
