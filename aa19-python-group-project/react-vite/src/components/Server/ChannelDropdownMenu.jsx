import { useState, useEffect, useRef } from "react";
import s from "./Server.module.css";
import CreateChannelButton from "../Modals/CreateChannelModal/CreateChannelModalButton";
import DeleteServerModalButton from "../Modals/DeleteServerModal/DeleteServerModalButton";
import DeleteChannelModalButton from "../Modals/DeleteChannelModal/DeleteChannelModalButton";
import ServerMemberButton from "../Modals/ServerMemberModal";
import UpdateChannelButton from "../Modals/UpdateChannelModal/UpdateChannelButton";
import { FaCirclePlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import UpdateServerModalButton from "../Modals/UpdateServerModal/UpdateServerModalButton";
import { PiNotePencil } from "react-icons/pi";
import { FaPencilAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaGear } from "react-icons/fa6";

function ChannelDropdownMenu({ channelId, serverChannels }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleMouseLeave = () => {
    if (!triggerRef.current.matches(":hover")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className={s.channel_dropdown} ref={dropdownRef}>
          <div className={s.channel_menu_container}>
            <UpdateChannelButton
              channelId={channelId}
              Component={UpdateChannelButtonComponent}
              closeDropdown={closeDropdown}
            />
            <DeleteChannelModalButton
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
