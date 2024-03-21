import React from 'react'
import { Navigate } from 'react-router-dom';

const Protected= (props) => {
  const { Component } = props;
  const tokenn = JSON.parse(localStorage.getItem("token"));

  return (tokenn === null) ? <Component /> : <Navigate to={"/login"} />;
};

export default Protected