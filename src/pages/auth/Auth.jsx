import { useContext, useRef, useState } from "react";
import "./auth.css";

import { loginCall } from "../../redux/apiCalls";

import { CircularProgress } from "@material-ui/core";
import {useNavigate } from "react-router-dom" ;
import { useDispatch } from "react-redux";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();
    console.log(email)
    loginCall(dispatch, {email, password});
    
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
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="loginInput"
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="loginInput"
            />
            <button className="loginButton" type="submit" >
                "Log In"
            </button>
            <span className="loginForgot">Forgot Password?</span>
          </form>
        </div>
      </div>
    </div>
  );
}