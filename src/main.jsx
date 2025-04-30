import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Blog from "./pages/Blog";
import PostPage from "./pages/PostPage";
import Contact from "./pages/Contact";
import "./blog.css";

// Definir o caminho base para toda a aplicação React
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/blog">
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/:id" element={<PostPage />} />
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/create-post" element={<CreatePost />} />
        <Route path="/admin/create-post/:id" element={<CreatePost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);