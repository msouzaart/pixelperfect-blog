// components/LoginHeader.jsx
import React from "react";
import logo from "../assets/logo-fulll.png"; // ajuste para o caminho real da sua logo

export default function LoginHeader() {
  return (
    <div className="login-header">
      <img src={logo} alt="Logo" className="logoLogin" />
      <h1 className="titleLogin">Good to see you again!</h1>
    </div>
  );
}
