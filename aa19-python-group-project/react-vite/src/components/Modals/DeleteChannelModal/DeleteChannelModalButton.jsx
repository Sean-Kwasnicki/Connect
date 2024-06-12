import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import DeleteChannelModal from "./DeleteChannelModal";
import { IoIosClose } from "react-icons/io";
import s from "./DeleteChannelModalButton.module.css";

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
    <button className={s.iconButton} onClick={toggleMenu}>
      <OpenModalMenuItem
        itemText={<IoIosClose className={s.deleteIcon} />}
        onItemClick={() => setShowMenu(false)}
        modalComponent={<DeleteChannelModal channelId={channelId} serverId={serverId} />}
      />
    </button>
  );
}

export default DeleteChannelModalButton;
