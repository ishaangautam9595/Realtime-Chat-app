import React, { useEffect, useState, useContext, useCallback } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import Welcome from "../components/Welcome";
import { toast } from "react-toastify";
import { instance } from "../utils/Instance";
import Sidebar from "../components/Sidebar/Sidebar";
import { Socket } from "../context/SocketSlice";

export default function Chat() {
  const { socket } = useContext(Socket);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [activeUser, setActiveUser] = useState([]);
  const [groups, setGroups] = useState([]);
  const [count, setCount] = useState("");
  const [notificationdot, setNotificationdot] = useState({});
  const [notificationind, setNotificationind] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));
  const data = JSON.parse(localStorage.getItem("chat-app-current-user"));

  const fetchSidebarData = useCallback(() => {
    instance
      .get(`${allUsersRoute}`)
      .then((res) => {
        setContacts(res.data.data.response);
        setCount(res.data.data.notificationCount);
        setNotificationind(res.data.data.groupUnreadCount);
      })
      .catch((error) => toast.warn(error.message));
  }, []);

  const fetchGroups = () => {
    instance.get(`/all/rooms`).then((res) => {
      setGroups(res.data.data);
    });
  };

  useEffect(() => {
    token && fetchSidebarData();
  }, [fetchSidebarData, token]);

  const handleChatChange = (chat) => setCurrentChat(chat);

  useEffect(() => {
    if (token && data) {
      const userId = data._id;
      socket.emit("connects", userId);
      socket.on("updateUserStatus", (user) => setActiveUser(user));
      socket.on(
        "unread-count-listener",
        (mdata) => data._id === mdata.toId && fetchSidebarData()
      );

      socket.on("group-msg-listener", (groupdata) => {
        setNotificationdot(groupdata);
      });
    }
    // eslint-disable-next-line
  }, [socket, fetchSidebarData, token]);

  if (token) {
    return (
      <Container>
        <div className="container">
          <Sidebar
            activeUser={activeUser}
            contacts={contacts}
            currentChat={setCurrentChat}
            changeChat={handleChatChange}
            fetchGroups={fetchGroups}
            groups={groups}
            setGroups={setGroups}
            setCount={setCount}
            count={count}
            notificationdot={notificationdot}
            setNotificationdot={setNotificationdot}
            notificationind={notificationind}
          />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              socket={socket}
              activeUser={activeUser}
              setCount={setCount}
              fetchGroups={fetchGroups}
              count={count}
              fetchSidebarData={fetchSidebarData}
              setNotificationdot={setNotificationdot}
            />
          )}
        </div>
      </Container>
    );
  } else {
    return <Navigate to={"/login"} />;
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #dedede;
  .container {
    height: 100vh;
    width: 100vw;
    background-color: #e6e4ff;
    display: grid;
    grid-template-columns: 400px auto;
    @media (max-width: 768px) {
      grid-template-columns: 0px auto;
      position: relative;
    }
  }
`;
