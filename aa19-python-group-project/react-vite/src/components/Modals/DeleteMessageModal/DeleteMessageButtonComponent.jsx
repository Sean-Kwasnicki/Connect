import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';


const DeleteMessageButtonComponent = () => {
  return (
    <div className='delete_message_button'>
      <span>Delete Message</span>
      <FaRegTrashAlt className='delete_message_icon' />
    </div>
  );
};

export default DeleteMessageButtonComponent;
