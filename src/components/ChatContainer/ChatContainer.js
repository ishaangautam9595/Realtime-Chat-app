import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import groupphoto from "../../assets/author-9.jpg";
import { instance } from "../../utils/Instance";
import { MdDone, MdDoneAll } from "react-icons/md";
import moment from "moment";
import { host } from "../../utils/APIRoutes";
import document from "../../assets/document.jpg";
import { BsChevronCompactDown } from "react-icons/bs";
import Dropdown from "../Dropdown/Dropdown";

const mystyle2 = {
  color: "#812eba",
  height: "20px",
  width: "20px",
  marginLeft: "0px",
  marginTop: "0px",
};
const docExt = [
  "application/doc",
  "application/docx",
  "application/pdf",
  "application/zip",
  "application/xls",
  "application/json",
];
const imgExt = [
  "image/img",
  "image/png",
  "image/gif",
  "image/jpeg",
  "image/jpg",
];

export default function ChatContainer({
  currentChat,
  socket,
  activeUser,
  fetchSidebarData, setNotificationdot,fetchGroups
}) 
{
  const [options, setOptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [fileimage, setFileimage] = useState("");
  const [imgData, setImgData] = useState(null);

  const data = JSON.parse(localStorage.getItem("chat-app-current-user"));
 
  const fetchMessage = useCallback(() => {
    instance
      .get(
        `/messages/${currentChat._id}/fetch?type=${
          currentChat.type ?? "personal"
        }`
      )
      .then((res) => {
        const data = res.data.data.records;
        setMessages(data);
        fetchSidebarData();
        fetchGroups();
      });
      // eslint-disable-next-line
  }, [currentChat, fetchSidebarData]);


  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);


  useEffect(() => {
    if (currentChat.type === "group") {
      socket.emit("user-connect", {
        roomId: currentChat._id,
      });
      fetchMessage();
    }
    if (currentChat.type !== "group")
      socket.emit("user-connect", {
        toId: currentChat._id,
        fromId: data._id,
      });
    fetchMessage();

  
  }, [currentChat, data?._id, socket, fetchMessage]);



  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem("chat-app-current-user"))._id;
      }
    };
    getCurrentChat();

    return () => {
      socket.emit("user-disconnect");
    };
  }, [currentChat, socket]);

  const handleSendMsg = async (msg, file, messageType) => {
    if (msg.length > 0) {
      if (currentChat.type !== "group") {
        socket.emit("sent-message", {
          toId: currentChat._id,
          fromId: data._id,
          message: msg,
          file: file,
          messageType,
        });
      }
      if (currentChat.type === "group") {
        socket.emit("sent-message", {
          roomId: currentChat._id,
          fromId: data._id,
          message: msg,
          file: file,
          messageType,
        });
      }
    }
  };

  useEffect(() => {
    socket.on("msg-recieve", (mdata) => {
      setArrivalMessage({
        fromSelf: mdata.fromId === data._id ? true : false,
        message: mdata.message,
        fromId: mdata.fromId,
        messageType: mdata.messageType,
      });
    });
    socket.on("group-msg-listener", (groupdata) => {
      setNotificationdot(groupdata);
    });
  }, [socket, data._id, setNotificationdot]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  const scrollDown = () => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  useEffect(() => {
    instance.get(`/group/member/${currentChat._id}`).then((res) => {
      setOptions(res.data.data);
    });
  }, [currentChat]);

  return (
    <>
      <Container>
        <div className="chat-header">
          <div className="user-details">
            <div className="avatar">
              {currentChat.type === "group" ? (
                <img src={groupphoto} alt="avatar" />
              ) : (
                <div>
                  <div className="avatars">
                    <p>{currentChat.username.split(" ").map((name) => name[0]).join("").toUpperCase()}
                    </p>
                  </div>
                  <div
                    className={
                      activeUser.includes(currentChat._id) ||
                      currentChat.status === "online"
                        ? "status-circle-online"
                        : "status-circle"
                    }
                  ></div>
                </div>
              )}
            </div>
            <div className="username">
              <h4>
                {currentChat.type === "group"
                  ? currentChat.name
                  : currentChat.username}
              </h4>
              {currentChat.type !== "group" ? (
                <p>
                  {activeUser.includes(currentChat._id) ||
                  currentChat.status === "online"
                    ? "online"
                    : "offline"}
                </p>
              ) : (
                <p>{options.length} members</p>
              )}
            </div>
          </div>
          <div className="user-settings">
            {currentChat.type === "group" ? (
              <Dropdown options={options} currentChat={currentChat}/>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="chat-messages">

          {messages?.map((message) => {
            return (
              <div key={uuidv4()}>
                <div ref={scrollRef}>
                  <div
                    className={`message ${
                      message.fromSelf || message?.fromId?._id === data._id
                        ? "sended"
                        : "recieved"
                    }`}
                  >
                    <div>
                      {currentChat?.type === "group" &&
                      message?.fromId?._id !== data._id ? (
                        <div className="groupmem">
                          <div className="avatars">
                            <p>{message?.fromId?.username.split(" ").map((name) => name[0]).join("").toUpperCase()}</p></div>
                          <div className="status-circle-online"></div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div><div className="content"><div className="line">
                        <h6>{moment(message?.created).fromNow()}</h6>
                      </div>
                      {currentChat.type === "group" ? (
                        <>
                          {imgExt.includes(message.messageType) && (
                            <a href={imgData} target="_blank" rel="noreferrer">
                              <img
                                src={`${host}${message.message}`}
                                alt=""
                                className="messageimg"
                              />
                            </a>
                          )}
                          {docExt.includes(message.messageType) && (
                            <a
                              href={`${host}${message.message}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                alt="images"
                                src={document}
                                className="messageimg"
                              />
                            </a>
                          )}
                          {message.messageType === "text/plain" && (
                            <p>{message.message}</p>
                          )}
                        </>
                      ) : (
                        <>
                          {message.messageType === "text/plain" && (
                            <p>
                              {(currentChat._id === message.fromId._id ||
                                data._id === message.fromId._id) &&
                                message.message}
                            </p>
                          )}
                          
                          {imgExt.includes(message.messageType) && (
                            <a href={imgData} target="_blank" rel="noreferrer">
                              <img
                                src={`${host}${message.message}`}
                                alt=""
                                className="messageimg"
                              />
                            </a>
                          )}
                          {docExt.includes(message.messageType) && (
                            <a
                              href={`${host}${message.message}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                alt="images"
                                src={document}
                                className="messageimg"
                              />
                            </a>
                          )}
                        </>
                      )}
                      <div className="message-tick">
                        {message.read === true ? (
                          <MdDoneAll style={mystyle2} />
                        ) : (
                          <MdDone style={mystyle2} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                { messages.length > 10 ?
              <div className="scroll" onClick={scrollDown}> 
              <BsChevronCompactDown />
              </div>
              :
              <></>
              }
              </div>
            );
          })}
        </div>
        <div className="main">
          <ChatInput
            handleSendMsg={handleSendMsg}
            currentChat={currentChat}
            fileimage={fileimage}
            setFileimage={setFileimage}
            docExt={docExt}
            imgExt={imgExt}
            imgData={imgData}
            setImgData={setImgData}
          />
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  overflow: hidden;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 0 2rem;
    box-shadow: 0px 0px 15px 0px #291c4426;
    @media (max-width: 768px) {
      padding-left: 60px;
    }
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 5px;
      .avatars {
        background-color: #812eba !important;
        color: black;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        padding: 14px;
        font-weight: bold;
      }
      .avatars p {
        font-size: 17px !important;
      }
      .avatar {
        img {
          height: 2.6rem;
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
        .status-circle-online {
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
      .username {
        h4 {
          color: #000000;
        }
        p {
          color: #666666;
        }
        h3 {
          color: white;
          text-transform: capitalize;
          margin-top: -5px;
        }
      }
    }
    .user-settings {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        color: #6e6e6e;
        font-size: 16px;
        margin-right: 20px;
        padding-right: 20px;
      }
      svg {
        color: #291c44;
        font-size: 26px;
      }
    }
  }
  .line {
    display: flex;
  }
  img {
    border-radius: 50%;
  }
  .status {
    font-size: 14px;
    color: white;
    margin-bottom: 5px;
  }
  .chat-messages {
    padding: 1rem 2rem;
    margin: 0px 5px 0px 0px;
    background-color: rgba(229, 229, 255, 255);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 0.3rem;
      &-thumb {
        background-color: #fff;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 500px;
        overflow-wrap: break-word;
        padding: 0.5rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (max-width: 768px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        .line {
          justify-content: flex-end;
        }
        p {
          background-color: #ffffff;
          font-size: 14px;
          color: #291c44;
          padding: 14px 32px;
          border-radius: 50px 0px 50px 50px;
          width: 100%;
        }
        .message-tick {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
    .recieved {
      justify-content: flex-start;
      p {
        img {
          height: 3rem;
        }
        .status-circle-online {
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

      .content {
        p {
          background-color: #291c44;
          font-size: 14px;
          color: #fff;
          padding: 14px 32px;
          border-radius: 0px 50px 50px 50px;
        }
        .message-tick {
          svg {
            display: none;
          }
        }
      }
    }
  }
  h6 {
    font-size: 12px;
    color: #666666;
    padding-bottom: 6px;
    font-weight: 400;
  }
  h4 {
    text-transform: capitalize;
    color: white;
    font-size: 16px;
  }
  .main {
    background-color: #ffffff;
    margin: 0;
    box-shadow: 0px 0px 15px 0px #291c4426;
  }
  select {
    padding: 10px;
    border-radius: 10px;
    margin-right: 10px;
    border: none;
    background-color: #fff;
  }
`;
