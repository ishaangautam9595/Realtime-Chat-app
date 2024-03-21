import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import styled from "styled-components";
import { Socket } from "../context/SocketSlice";

export default function Logout() {

  const { socket } = useContext(Socket);
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("chat-app-current-user"))
  const handleClick = async () => {
    socket.emit("logout", data._id)
    await JSON.parse(
      localStorage.getItem("chat-app-current-user")
    )._id;
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Button onClick={handleClick}>
      <FiLogOut />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #271c46 !important;
  border: none;
  cursor: pointer;
  margin-left: 0px;
  height: 50px;
  width: 50px;
  margin-top: 0px;
  svg {
    font-size: 1.3rem;
    color: #fff !important;
  }
`;