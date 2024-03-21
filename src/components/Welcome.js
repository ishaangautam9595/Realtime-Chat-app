import React from "react";
import styled from "styled-components";
import Robot from "../assets/welcome.gif";
export default function Welcome() {
  
  const data = JSON.parse(localStorage.getItem('chat-app-current-user'))


  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{data.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
      
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  background-color: rgba(229,229,255,255);
  img {
    height: 17rem;
  }
  span {
    color: rgba(67,51,119,255);
    text-transform: capitalize;
  }
  h3{
    text-align: center;
  }
`;