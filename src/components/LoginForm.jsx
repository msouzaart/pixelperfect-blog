// components/LoginForm.jsx
import React from "react";
import EyePassword from "./EyePassword";
import ForgetPassword from "./ForgetPassword";

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleLogin,
  error,
  setError,
  setShowResetModal,
}) {
  return (
    <form className="formContainer" onSubmit={handleLogin}>
      <h2 className="formTitle">Login your account</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="input-group">
        <label htmlFor="email">Your email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group password-group">
        <label htmlFor="password">Your password:</label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <EyePassword
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword((v) => !v)}
        />
      </div>

      <ForgetPassword onClick={() => {
        setError("");
        setShowResetModal(true);
      }} />

      <button type="submit" className="btn-login">
        Login
      </button>
    </form>
  );
}
