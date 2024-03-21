import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link, Navigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Login() {

  const [passwordType, setPasswordType] = useState("password");

    const navigate = useNavigate();

    const [values, setValues] = useState({ email: "", password: "" });
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const tokenn = JSON.parse(localStorage.getItem("token"));

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

  const validateForm = () => {
    const { email, password } = values;
    if (password === "" && email === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password is required.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const togglePassword =()=>{
    if(passwordType==="password")
    {
     setPasswordType("text")
     return;
    }
    setPasswordType("password")
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { email, password } = values;
      const { data } = await axios.put(loginRoute, { email, password,}).catch((error) => {
        toast.error(error.response.data.message);
      });
      if (data.status === false) {
        toast.error(data.message, toastOptions);
      }
      if (data.status === "ok") {
        localStorage.setItem(
          "chat-app-current-user",
          JSON.stringify(data.data)
        );
        localStorage.setItem(
          "token",
          JSON.stringify(data.token)
        );
        navigate("/");
        window.location.reload(true);
      }
    }
  };
  if (tokenn) {
    return <Navigate to={'/'} />
  } else {
  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Tp Chat</h1>
          </div>
          <input
            type="text"
            placeholder="Email"
            name="email"
            required
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <div className="flex">
          <input
           type={passwordType}
            placeholder="Password"
            name="password"
            required
            onChange={(e) => handleChange(e)}/>
          <button className="eyebutton" type="button" onClick={togglePassword}>
          {passwordType === "password" ?  <AiFillEyeInvisible/> :  <AiFillEye />}
          </button>
          </div>
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 10px;
  gap: 1rem;
  align-items: center;
  background-color: #271c46;
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 30px;
    img {
      height: 5rem;
    }
    h1 {
      color: rgba(67,51,119,255);
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0rem;
    background-color: #fff;
    border-radius: 0px;
    padding: 4rem;
    max-width: 500px;
    width: 100%;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #DEDEDE;
    border-radius: 0px;
    color: black;
    width: 100%;
    font-size: 1rem;
    margin-bottom: 16px;
    &:focus {
      border: 0.1rem solid rgba(33,25,64,255);
      outline: none;
    }
  }
  button {
    background: linear-gradient(186deg, #a937cc, #6a00ff);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0px;
    font-size: 1rem;
    text-transform: uppercase;
    margin-bottom: 16px;
    transition:all .4s ease;
    &:hover {
      background: linear-gradient(186deg, #6a00ff , #a937cc);
    }
  }
  span {
    color: rgb(33 25 64);
    text-transform: capitalize;
    text-align: center;
    font-size: 16px;
    a {
      color: rgba(67,51,119,255);
      text-decoration: none;
      font-weight: bolder;
    }
  }
`;