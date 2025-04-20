// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import LoginForm from "../components/LoginForm";
import LoginHeader from "../components/LoginHeader";
import ResetPasswordModal from "../components/ResetPasswordModal";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [error, setError] = useState("");

  // Mantém usuário logado se já estiver autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      // Exibe mensagem de erro mais amigável
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Email inválido.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Email ou senha incorretos.');
          break;
        case 'auth/user-disabled':
          setError('Usuário desabilitado.');
          break;
        default:
          setError('Erro ao fazer login. Tente novamente.');
      }
    }
  };

  return (
    <main className="mainLogin">
      <LoginHeader />

      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}
        error={error}
        setError={setError}
        setShowResetModal={setShowResetModal}
      />

      {showResetModal && (
        <ResetPasswordModal
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          handlePasswordReset={handlePasswordReset}
          onClose={() => setShowResetModal(false)}
        />
      )}

      <ToastContainer position="top-right" autoClose={5000} />
    </main>
  );
}

export default Login;
