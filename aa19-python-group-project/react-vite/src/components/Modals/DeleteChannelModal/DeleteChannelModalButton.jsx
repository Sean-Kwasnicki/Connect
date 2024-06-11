import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteChannelModal from "./DeleteChannelModal";

function DeleteChannelModalButton({ channelId }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  return (
    <button onClick={toggleMenu}>
      <OpenModalMenuItem
        itemText="Delete Channel"
        onItemClick={closeMenu}
        modalComponent={<DeleteChannelModal channelId={channelId} />}
      />
    </button>
  );
}

export default DeleteChannelModalButton;
