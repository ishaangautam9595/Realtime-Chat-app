import React from "react";
import loader from "../assets/loader.gif";
import styled from "styled-components";

export default function Spinner() {
  return (
    <>
      {" "}
      <Container>
        <img src={loader} alt="loader" className="loader" />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
`
