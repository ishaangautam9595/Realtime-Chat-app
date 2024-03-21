import React, { Fragment } from "react";
import styled from "styled-components";

const Modal = ({ title, footer, children, active, hideModal, subHeading, subtitle }) => {
  return (
    <Fragment>
      {active && (
        <ModalBlock>
          <ModalOverlay onClick={() => hideModal()}></ModalOverlay>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <ModalClose onClick={() => hideModal()}>X</ModalClose>
            </ModalHeader>
              <ModalPara>{subtitle}</ModalPara>
            <ModalSubHeading>{subHeading}</ModalSubHeading>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>{footer}</ModalFooter>
          </ModalContainer>
        </ModalBlock>
      )}
    </Fragment>
  );
};
export default Modal;

export const ModalBlock = styled.div`
  align-items: center;
  bottom: 0;
  justify-content: center;
  left: 0;
  overflow: hidden;
  padding: 0.4rem;
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  opacity: 1;
  z-index: 400;
`;

export const ModalOverlay = styled.a`
  background: rgb(39 28 70 / 72%);
  bottom: 0;
  cursor: default;
  display: block;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

export const ModalClose = styled.a`
  float: right !important;
  text-decoration: none !important;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 10px;
`;

export const ModalContainer = styled.div`
  background: #ffffff;
  border-radius: 0.1rem;
  display: flex;
  flex-direction: column;
  max-height: 75vh;
  max-width: 850px;
  padding: 0 0.8rem;
  border-radius: 10px;
  overflow: none;
  width: 100%;
  height: 500px;
  position: relative;
  animation: slide-down 0.2s ease 1;
  z-index: 1000;
  box-shadow: 0 0.2rem 0.5rem rgba(48, 55, 66, 0.3);
`;

export const ModalBody = styled.div`
  overflow-y: auto;
  padding: 10px 20px;
  height 300px;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #303742;
  padding: 10px 5px 10px 5px;
  text-transform: uppercase;
  padding: 10px;
  border-bottom : 1px solid black;

`;

export const ModalTitle = styled.span`
  font-size: 30px;
  font-weight: 500;
  padding: 15px 10px;
`;

export const ModalPara = styled.span`
font-size: 15px;
color: gray;
text-align: start;
margin-top: -20px;
margin-left: 20px
`;

export const ModalSubHeading = styled.div`
  font-size: 25px;
  font-weight: 300;
  padding: 20px 20px;
`;

export const ModalFooter = styled.div`
  padding: 10px 0px;
  text-align: right;
  bottom : 0;
  position: absolute;
  right: 0;
`;

export const Button = styled.button`
  background: #7b2cbf;
  color: white;
  font-size: 1em;
  margin: 10px;
  padding: 5px 10px;
  border: 2px solid #7b2cbf;
  border-radius: 3px;
  cursor: pointer;
`;
