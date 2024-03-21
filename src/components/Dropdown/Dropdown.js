import React from 'react'
import { AiFillSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { instance } from '../../utils/Instance';
import Members from '../ChatContainer/Members';
import { Button } from '../Modal';
import './Dropdown.css';

const Dropdown = ({options, currentChat}) => {

  const data = JSON.parse(localStorage.getItem("chat-app-current-user"));

  const handleDeleteChat = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        instance.delete(`/group/${currentChat._id}`).then(() => {
          window.location.reload();
        }).catch((error) => { 
          toast.warn(`Error:deleteGroup ${error.message}`);
        });
      }
    })
  }

  const handleLeaveChat = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        instance.put(`/group/leave/${currentChat._id}`, {
          userId : data._id
        }).then(() => {
          window.location.reload();
        }).catch((error) => { 
          toast.warn(`Error:deleteGroup ${error.message}`);
        });
      }
    })
  }

  
  
  return (
    <div>
 <ul id="gnb">
    <li>
      <Link to="#" className="open"><AiFillSetting /></Link>
      <ul className="lnb">
        <li><Members option={options} currentChat={currentChat}/></li>
        {currentChat.fromId === data._id ?
          <>
        <li><Button onClick={handleDeleteChat}>Delete Group</Button></li>
        </>
        :
        <>
        <li><Button onClick={handleLeaveChat}>Leave Group</Button></li>
        </>
}
      </ul>
    </li>
    </ul>
    </div>
  )
}

export default Dropdown