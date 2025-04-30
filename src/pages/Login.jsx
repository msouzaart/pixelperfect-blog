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
  const [rememberMe, setRememberMe] = useState(false);

  // Mantém usuário logado se já estiver autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return unsubscribe;
  }, [navigate]);

  // Carrega email e senha salvos (se houver)
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      navigate("/dashboard");
    } catch (err) {
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

  const handlePasswordReset = async () => {
    // sua lógica de reset de senha (se já tiver ou quiser que eu adicione)
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
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
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
