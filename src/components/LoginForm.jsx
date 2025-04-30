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
  rememberMe,
  setRememberMe,
}) {
  return (
    <form
      className="formContainer"
      onSubmit={handleLogin}
      aria-labelledby="login-form-title"
    >
      <h1 id="login-form-title" className="formTitle">
        Login to your account
      </h1>

      {error && (
        <p
          className="error-message"
          id="login-error"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}

      <div className="input-group email-group">
        <label className="labeForm" htmlFor="email">
          Your email:
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={!!error}
          aria-describedby={error ? "login-error" : undefined}
          autoComplete="email"
          placeholder="ex: nome@email.com"
        />
      </div>

      <div className="input-group password-group">
        <label className="labeForm" htmlFor="password">
          Your password:
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-required="true"
          autoComplete="current-password"
        />
        <EyePassword
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword((v) => !v)}
          ariaControls="password"
        />
      </div>

      <ForgetPassword
        onClick={() => {
          setError("");
          setShowResetModal(true);
        }}
      />
      <div className="remember-me-group">
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Lembrar-me
        </label>
      </div>

      <button
        type="submit"
        className="btn-login"
        aria-label="Login to your account"
      >
        Login
      </button>
    </form>
  );
}
