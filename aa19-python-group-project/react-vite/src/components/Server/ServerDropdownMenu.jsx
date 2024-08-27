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

function ServerDropdownMenu({ serverId, closeDropdown, channels }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div onClick={toggleDropdown}>
        {isOpen ? (
          <RxCross2 className={s.arrow} />
        ) : (
          <IoIosArrowDown className={s.arrow} />
        )}
      </div>
      {isOpen && (
        <div className={s.server_menu_container}>
          <CreateChannelButton
            Component={CreateChannelButtonComponent}
            closeDropdown={closeDropdown}
          />
          <ServerMemberButton
            Component={ServerMemberButtonComponent}
            closeDropdown={closeDropdown}
          />
          <UpdateServerModalButton
            Component={UpdateServerButtonComponent}
            closeDropdown={closeDropdown}
          />
          <DeleteServerModalButton
            Component={DeleteServerButtonComponent}
            closeDropdown={closeDropdown}
          />
        </div>
      )}
    </div>
  );
}

const CreateChannelButtonComponent = () => {
  return (
    <div className={s.server_menu_button}>
      <span>Create Channel</span>
      <FaCirclePlus className={s.server_menu_button_symbol} />
    </div>
  );
};

const DeleteServerButtonComponent = () => {
  return (
    <div className={s.server_menu_button}>
      <span>Delete Server</span>
      <FaRegTrashAlt className={s.server_menu_button_symbol} />
    </div>
  );
};

const ServerMemberButtonComponent = () => {
  return (
    <div className={s.server_menu_button}>
      <span>Invite People</span>
      <FaCirclePlus className={s.server_menu_button_symbol} />
    </div>
  );
};

const UpdateServerButtonComponent = () => {
  return (
    <div className={s.server_menu_button}>
      <span>Update Server</span>
      <PiNotePencil className={s.server_menu_button_symbol} />
    </div>
  );
};

export default ServerDropdownMenu;
