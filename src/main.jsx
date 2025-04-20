// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Blog from "./pages/Blog";
import PostPage from "./pages/PostPage"; // Ajuste o nome do import aqui

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* BLOG */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<PostPage />} /> {/* Ajuste o nome da rota */}

        {/* CREATE / EDIT POST */}
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-post/:id" element={<CreatePost />} />

        {/* QUALQUER OUTRA ROTA VAI PARA LOGIN */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
