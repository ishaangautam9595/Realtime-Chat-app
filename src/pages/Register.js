import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import Swal from "sweetalert2";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (email === "" && username === "" && password === "" && confirmPassword === "") {
      toast.error("Every field should be filled.", toastOptions);
      return false;
    }
     else if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password is required.", toastOptions);
      return false;
    } else if (username === "") {
      toast.error("username is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      }).catch((error) => {
        toast.error(error.response.data.message);
      });


      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === "ok") {
        toast.success('Registered successfully.');
        localStorage.setItem(
          "chat-app-current-user",
          JSON.stringify(data)
          );
          Swal.fire(
            'Successful Registration!',
            'Please Login to continue!',
            'success'
          )
        navigate("/login")
      }
    }
  };

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
            placeholder="Name"
            name="username"
            required
            onChange={(e) => handleChange(e)}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            style={{position: "relative"}}
            onChange={(e) => handleChange(e)}
          />
          
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
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
  background-color:  #271c46;
  .brand {
    display: flex;
    align-items: center;
    gap: .5rem;
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
    gap: 0  rem;
    background-color: #fff;
    border-radius: 0px;
    padding: 4rem;
    max-width: 500px;
    width: 100%;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #D3D3D3;
    border-radius: 0;
    color: black;
    width: 100%;
    font-size: 1rem;
    position: relative;
    margin-bottom:16px;
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
    border-radius: 0;
    font-size: 1rem;
    text-transform: uppercase;
    margin-bottom:16px;
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