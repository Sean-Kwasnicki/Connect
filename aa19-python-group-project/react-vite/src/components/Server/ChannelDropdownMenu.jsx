import { useState, useEffect, useRef } from "react";
import s from "./Server.module.css";
import DeleteChannelModalButton from "../Modals/DeleteChannelModal/DeleteChannelModalButton";
import UpdateChannelButton from "../Modals/UpdateChannelModal/UpdateChannelButton";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";

import { FaGear } from "react-icons/fa6";

function ChannelDropdownMenu({ serverId, channelId, serverChannels }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleMouseLeave = () => {
    if (isOpen) {
      if (!triggerRef.current.matches(":hover")) {
        setIsOpen(false);
      }
    }
  };

  const DeleteChannelButtonComponent = () => {
    return (
      <div className={s.server_menu_button} onClick={closeDropdown}>
        <span>Delete Channel</span>
        <FaRegTrashAlt className={s.server_menu_button_symbol} />
      </div>
    );
  };

  const UpdateChannelButtonComponent = () => {
    return (
      <div className={s.server_menu_button} onClick={closeDropdown}>
        <span>Update Channel</span>
        <FaPencilAlt className={s.server_menu_button_symbol} />
      </div>
    );
  };

  return (
    <div onMouseLeave={handleMouseLeave} ref={triggerRef}>
      <div onClick={toggleDropdown} className={s.channel_gear_button}>
        <FaGear />
      </div>
      {isOpen && (
        <div className={s.channel_dropdown}>
          <div className={s.channel_menu_container}>
            <UpdateChannelButton
              serverId={serverId}
              channelId={channelId}
              Component={UpdateChannelButtonComponent}
              closeDropdown={closeDropdown}
            />
            <DeleteChannelModalButton
              serverId={serverId}
              serverChannels={serverChannels}
              channelId={channelId}
              Component={DeleteChannelButtonComponent}
              closeDropdown={closeDropdown}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelDropdownMenu;
