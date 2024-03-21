import React, { useContext, useEffect, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { IconContext } from "react-icons";
import styled from "styled-components";
import Logo from "../../assets/logo.png";
import photo2 from "../../assets/author-9.jpg";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { MdSearch } from "react-icons/md";
import { AiTwotoneSetting } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import Logout from "../Logout";
import Modal, { Button } from "../Modal";
import { instance } from "../../utils/Instance";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { debounce } from "lodash";
import Notification from '../Notification';
import { Socket } from "../../context/SocketSlice";

const mystyle = {
  color: "#ffffff4d",
  height: "25px",
  width: "25px",
  cursor: "pointer",
};
const mystyle2 = {
  color: "#ffffff4d",
  height: "25px",
  width: "25px",
  marginLeft: "0px",
  marginTop: "0px",
  cursor: "pointer",
};


export default function Sidebar({contacts, changeChat, notificationind, activeUser, count, setNotificationdot, setCount, currentChat, groups, setGroups ,fetchGroups, notificationdot}) {
  const [sidebar, setSidebar] = useState(true);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [search, setSearch] = useState("");
  const [groupName, setGroupName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState("");
  const [openMenu, setOpenMenu] = useState("individual");
  const refs = useRef(null);
  const [notifications, setNotifications] = useState([]);

  const { socket } = useContext(Socket);

const fetchNotification = () => {
    instance.get(`/notifications/list`).then((response) => {
      setNotifications(response.data.data.response);
  })
};

const handleNotification = () => {
  instance.post(`/notifications/read`, {
    type: "group", actionType : data._id
  }).then((response) => {
    setNotifications(response.data.data.response);
    setCount(0);
});
}

const showSidebar = () => setSidebar(!sidebar);

  const options = searchResult?.map((item) => {
    return { value: item._id, label: item.username };
  });
  
  const data = JSON.parse(localStorage.getItem("chat-app-current-user"));

  useEffect(() => {
    handleSearch();
    setCurrentUserName(data.username);
  }, [data.username]);

  const changeCurrentChatHandle = (index, record) => {
    refs.current.value = "";
    setSearch("");
    setCurrentSelected(index);
    changeChat(record);
    fetchGroups();
      setNotificationdot({});
  };


  const handleSearch = async (selectedOption) => {
    try {
      const data = await instance.get(`/all/users`);
      setSearchResult(data.data.data.response);
      setSelected(selectedOption);
    } catch (error) {}
  };

  const validateForm = () => {
    if (groupName === "") {
      toast.warn("name is required.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    socket.on("notification-msg", (ndata) => {
      toast.success(ndata);
      setCount(count => count+1);
      fetchNotification();
    })
  }, [socket, setCount])

  const handleSubmit = (e) => {
    if (validateForm()) {
      e.preventDefault();
      instance
        .post(`/create/room`, { name: groupName, users: selected })
        .then((res) => {
          const { data } = res.data;
          setGroups([...groups, data]);
          setCurrentSelected(data._id);
          setActive(false);
          fetchGroups();
          changeChat(data);
          toast.success("Group Created Successfully");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
        socket.emit("notification",{
          users : selected,
          name : groupName,
          admin : data.username
        });
    }
  };


  const func = () => {
    refs.current.value = "";
    setSearch("");
  };
  
  const filteredContacts = contacts?.filter((val) =>
  val.username.toLowerCase().includes(search)
  );
  const filteredGroups = groups?.filter((val) =>
  val.name.toLowerCase().includes(search)
  );

  const obj = groups.find(o => o.isRead === false);

  const updateQuery = (e) =>
  setGroupName(e?.target?.value);
  const debouncedOnChange = debounce(updateQuery, 1000);

  return (
    <>
      <IconContext.Provider value={{ color: "#921bb7" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaArrowLeft
              style={{ color: "#271c46" }}
              onClick={showSidebar}
            />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars1">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
          </ul>
          {currentUserName && (
            <Container>
              <div className="brand">
                <div className="left" onClick={() => currentChat(undefined)}>
                  <img src={Logo} alt="logo" />
                  <h2>Tp Chat</h2>
                </div>
              </div>

              <Modal
                  active={active}
                  hideModal={() => setActive(false)}
                  title="Create Group"
                  footer={
                    <Button onClick={(e) => handleSubmit(e)}>
                      Create Group
                    </Button>
                  }
                >
                  <input
                    type="text"
                    className="inputss"
                    placeholder="Type Group Name"
                    onChange={debouncedOnChange}
                    required
                  />
                  <Select
                    options={options}
                    Searchable
                    isMulti
                    autoFocus
                    onChange={handleSearch}
                  />
                </Modal>
              <div className="icons">
                <BsFillChatLeftDotsFill
                  style={mystyle}
                  className={openMenu === "individual" ? "active" : ""}
                  onClick={() => {
                    setOpenMenu("individual") || func();
                  }}
                />
                {notificationdot.roomId !== undefined || obj || notificationind > 0 ? <span className="dot"></span> : ""}
                <FaIcons.FaUsers
                  style={mystyle2}
                  className={openMenu === "group" ? "active" : ""}
                  onClick={() => {
                    setOpenMenu("group") || func() || fetchGroups()
                  }}
                />
                  {count !== 0 ? 
                   <span className="badge">{count}</span>
                   : 
                   <></>
                  }
                <AiIcons.AiFillBell  style={mystyle} className={openMenu === "notification" ? "active" : ""}  onClick={() => {
                  setOpenMenu("notification") || func() || fetchNotification();
                }}/>
                <AiTwotoneSetting
                  style={mystyle}
                  className={openMenu === "setting" ? "active" : ""}
                  onClick={() => {
                    setOpenMenu("setting") || func();
                  }}
                />
              </div>
              <div className="search">
                <MdSearch style={mystyle} />
                <input
                  type="text"
                  className="inputs"
                  placeholder="Search Contacts"
                  ref={refs}
                  onChange={(e) => setSearch(e?.target?.value)}
                />
                <br />
              </div>
              {openMenu === "individual" && (
                <div className="contacts" onClick={showSidebar}>
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact, index) => {
                      return (
                        <div
                          key={contact._id}
                          className={`contact ${
                            index === currentSelected ? "selected" : ""
                          }`}
                          onClick={() =>
                            changeCurrentChatHandle(contact._id, contact)
                          }
                        >
                          <div className="avatars">
                            <p>
                              {contact.username
                                .split(" ")
                                .map((name) => name[0])
                                .join("")
                                .toUpperCase()}
                            </p>
                            <div
                              className={
                                activeUser.includes(contact._id) ||
                                contact.status === "online"
                                  ? "status-circle-online"
                                  : "status-circle"
                              }
                            ></div>
                          </div>
                          <div className="username">
                            <h2>{contact.username}</h2>
                            {contact.unreadCount > 0 ? (
                              <p>New Message!</p>
                            ) : (
                              <></>
                            )}
                          </div>
                          {contact.unreadCount > 0  ? (
                            <div className="unreadCount">
                              <p>{contact.unreadCount}</p>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div>
                      <h3>No result found!!</h3>
                    </div>
                  )}
                </div>
              )}
              {openMenu === "group" && (
                  <>
                <div className="contacts" onClick={showSidebar}>
                  <div className="right">
                  <Button onClick={() => setActive(true)}>Create Group</Button>
                  </div>
                  {filteredGroups?.length > 0 ? (
                    filteredGroups?.map((group) => {
                      return (
                        <div
                          className="contact"
                          key={group._id}
                          onClick={() =>
                            changeCurrentChatHandle(group._id, group)
                          }
                        >
                          <div className="avatar">
                            <img src={photo2} alt="" />
                          </div>
                         {(notificationdot.roomId !== undefined && group._id === notificationdot.roomId) || group.isRead === false ?
                          <div className="username flex">
                            <h2>{group.name}</h2>
                            <span className="groupdot"></span>
                          </div>
                          :
                          <div className="username">
                          <h2>{group.name}</h2>
                        </div>
                          }
                        </div>
                      );
                    }
                    )
                    ) : (
                      <div>
                      <h3>No result found!!</h3>
                    </div>
                  )}
                </div>
                  </>
              )}
              {openMenu === "setting" && (
                <div className="contacts" onClick={showSidebar}>
                  <div className="setting-sidebar active">
                    <div className="setting-list">
                      <h2>
                        <BiUser /> Account
                      </h2>
                      <ul>
                        <li>
                          <Link to="/#">
                            Edit Profile <IoIosArrowForward />
                          </Link>
                        </li>
                        <li>
                          <Link to="/#">
                            Change Password <IoIosArrowForward />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {openMenu === "notification" && (
                <Notification notifications={notifications} setNotifications={setNotifications} setCount={setCount} count={count} handleNotification={handleNotification}/>
              )}
              <div className="current-users">
                <div className="username">
                  <div className="avatars">
                    <p>
                      {currentUserName
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </p>
                  </div>
                  <h3>{currentUserName}</h3>
                </div>
                <div className="logout">
                  <Logout />
                </div>
              </div>
            </Container>
          )}
          <ToastContainer />
        </nav>
      </IconContext.Provider>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 5% 5% 70% 10%;
  overflow: hidden;
  background-color: rgba(39, 28, 70, 255);
  height: 100vh;
  width: 100vw;
  @media (max-width: 768px) {
    width: 100vw;
  }
  .brand {
    display: flex;
    align-items: center;
    display: flex;
    gap: 0.5rem;
    padding-top: 0px;
    justify-content: center;
    background-color: rgba(39,28,70,255);
    margin-bottom: 0px;
    margin-left: 0px;
    img {
      height: 2.0rem;
      margin-left: 10px
    }
    @media (max-width: 768px) {
      img {
        margin-left: 25px;
      }
  }
    h3 {
      color: white;
      text-transform: uppercase;
      display: block;
    }
    @media (max-width: 768px) {
      h3{
      display: none;
    }
  }
  }
  img {
    border-radius: 50%;
  }
  .icons svg:hover {
    color: #812eba !important;
}
  .contacts {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    color: white;
    margin: 0px 5px 0px 0px;
    overflow-x: hidden;
    @media screen (max-width: 768px) {
      overflow-x: hidden;
      overflow-y: scroll;
      margin: 0px
  }
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #fff;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact.selected {
      background: #812eba !important;
  }
    .contact {
      background-color: rgba(39, 28, 70, 255);
      min-height: 5rem;
      cursor: pointer;
      width: 100%;
      border-radius: 0px;
      padding: 1rem 1.5rem;
      display: flex;
      border-top: 1px solid #ffffff0d;
      gap: 1rem;
      align-items: center;
      margin-left: 0px;
      transition: 0.5s ease-in-out;
      &:hover{
        background-color: #812eba !important;
      }
      &:selected{
        background-color: #7b2cbf !important;
        margin-left: -1px;
      }
      @media screen (max-width: 768px) {
        .contact &:selected{
          background-color: #60598e !important;
        }
    }
      .avatar {
        position: relative;
        img {
          height: 3rem;
       
        }
        @media screen (max-width: 768px) {
            padding : 1.0rem;
        }
      }
      .username {
        h2 {
          color: #fff;
          text-transform: capitalize;
          display: block;
          font-weight:600;
          font-size:16px;
        }
        p{
          color: #ffffff70;
          font-size: 14px;
        }
    }
    .selected {
      background-color: rgba(33, 25, 64, 255);
    }
  }
    .username {
      h3 {
        color: white;
        margin-top: 13px;
        margin-left: -22px;
        display: block;
      }
    }
    @media screen (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
.status{
  position: absolute;
}
h2{
    color: #fff;
    margin-top: 2px;
}
  .status-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #b94b4b;
    border: 0px solid white;
    bottom: 7px;
    right: 0;
    position: absolute;
  }
    .status-circle-online{
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #1cad1c;
      border: 0px solid white;
      bottom: 7px;
      right: 0;
      position: absolute;
    }
  }
}
.current-users {
  text-transform: capitalize;
  background-color: #812eba !important;
    position: relative;
    color: white;
    padding-top: 0px;
    display: flex;
    background-color: #4f04ff21;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    .username{
      display:flex;
      img{
        height:3rem;
      }
      h3{
        margin-left:15px;
      }
    }
  }

`;
