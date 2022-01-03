import { useContext, useRef } from "react";
import "./auth.css";

import { loginCall } from "../../apiCalls";

import { CircularProgress } from "@material-ui/core";
import { AuthContext } from "../../context/AuthContext";
import {useNavigate } from "react-router-dom" ;

export default function Login() {
  const email = useRef();
  const password = useRef();
  const {isFetching, dispatch} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    console.log(email.current.value)
    loginCall(
        {
            email : email.current.value,
            password : password.current.value
        },
        dispatch
    );
    
    navigate("./", {replace:true})
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Admin Panel</h3>
          <span className="loginDesc">
            Connect to manage the Admin Dashboard .
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disable={isFetching ? true : false}>
            {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
          </form>
        </div>
      </div>
    </div>
  );
}