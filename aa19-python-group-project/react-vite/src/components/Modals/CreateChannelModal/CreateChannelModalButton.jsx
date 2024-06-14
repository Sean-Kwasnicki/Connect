import { useState, useEffect } from "react";
import OpenModalMenuItem from "../../Navigation/OpenModalMenuItem";
import CreateChannelModal from "./CreateChannelModal";

function CreateChannelModalButton({ Component, closeDropdown }) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      console.log("closeMenu called");
      setShowMenu(false);
      if (closeDropdown) closeDropdown();
    };

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [showMenu, closeDropdown]);

  return (
    <OpenModalMenuItem
      itemText="Create Channel"
      onItemClick={() => setShowMenu(false)}
      modalComponent={<CreateChannelModal closeDropdown={closeDropdown} />}
      Component={Component}
    />
  );
}

export default CreateChannelModalButton;
