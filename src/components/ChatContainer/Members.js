import React, { useContext, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Socket } from "../../context/SocketSlice";
import { instance } from "../../utils/Instance";
import Modal, { Button } from "../Modal";

const Members = ({ option, currentChat }) => {
  const [active, setActive] = useState(false);
  const [openMenu, setOpenMenu] = useState("members");
  const [result, setResult] = useState([]);
  const [selected, setSelected] = useState("");
  const { socket } = useContext(Socket);

  const data = JSON.parse(localStorage.getItem("chat-app-current-user"));


  const handleAddMember = () => {
    if (selected.length > 0) {
      instance
        .post(`/group/member/${currentChat._id}`, {
          user: selected,
        })
        .catch((err) => {
          toast.warn(err.response.data.message);
        });
        setActive(false);
        socket.emit("notification",{
          users : selected,
          name : currentChat.name,
          admin : data.username
        });
    }
  };

  function getDifference(result, option) {
    return result.filter((object1) => {
      return !option.some((object2) => {
        return object1.username === object2.userId.username;
      });
    });
  }

  const handleSearch = (selectedOption) => {
    setSelected(selectedOption);
  };


  const options = getDifference(result, option)?.map((item) => {
    return { value: item._id, label: item.username };
  });

  const handleRemoveMember = (id, user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        instance.put(`/group/member/${currentChat._id}`, {
          userId: id,
        });
        Swal.fire(
          'Deleted!',
          'Group has been Deleted.',
          'success'
        )
      }
    })
  };

  const handleModal = () => {
    setActive(true);
    instance.get(`/all/users`).then((response) => {
      setResult(response.data.data.response);
    });
  };
  
  return (
    <>
      <div>
        <Button onClick={handleModal}>Members</Button>
      </div>
      <Modal
        active={active}
        hideModal={() => setActive(false)}
        title={currentChat?.name}
        subtitle={<p>{option.length} members</p>}
        subHeading={
          <div className="flex">
                {openMenu !== "addmember" && currentChat.fromId === data._id ? (
                  <>
            <h6
              className={openMenu === "members" ? "active" : ""}
              onClick={() => {
                setOpenMenu("members");
              }}
            >
              <b>Member</b>
            </h6>
                    <button
                      className={openMenu === "addmember" ? "active" : ""}
                      onClick={() => {
                        setOpenMenu("addmember");
                      }}
                    >
                      +
                    </button>
                  </>
                ) : (
                  <>
                  <h6><b>Add Members</b></h6>
            <div className="flex">
              <button onClick={() => {setOpenMenu("members")}}>←</button>
          </div>
          </>
                )}          
                </div>
        }
        footer={
          openMenu === "addmember" && (
            <Button onClick={() => handleAddMember()}>Add members</Button>
          )
        }
      >
        {openMenu === "members" && (
          <>
          
            {option?.map((optionn) => (
              <div key={optionn.userId._id}>
                <div className="flex">
                  {currentChat.fromId === optionn.userId._id ? (
                    <p>{optionn.userId.username} (admin)</p>
                  ) : (
                    <p>{optionn.userId.username}</p>
                  )}
                  {currentChat.fromId !== optionn.userId._id && currentChat.fromId === data._id  ? (
                    <p
                      className="deleteicon"
                      onClick={() => handleRemoveMember(optionn.userId._id, optionn.userId.username)}
                    >x</p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {openMenu === "addmember" && (
          <>
        
            <Select
              options={options}
              Searchable
              isMulti
              autoFocus
              onChange={handleSearch}
            />
          </>
        )}
      </Modal>
    </>
  );
};

export default Members;
