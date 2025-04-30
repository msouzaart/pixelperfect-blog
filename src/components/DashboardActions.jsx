import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Eye } from 'lucide-react'; // exemplo: ícone para "sair" e "ver blog"


export default function DashboardActions({ onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="dashboard-actions" aria-label="Ações do dashboard">

      <button
        onClick={() => navigate("/create-post")}
        className="btn btn-primary"
        aria-label="New Article"
      >
       + New Article
      </button>

      <span className="btnDash">
      <button
        onClick={() => navigate("/blog")}
        className="btn btn-success"
        aria-label="View Blog"
      >
         <Eye size={16} style={{ marginRight: "0.5rem" }} />
        View Blog
      </button>

      <button
        onClick={onLogout}
        className="btn btn-danger ml-auto"
        aria-label="Logout"
      >
         <LogOut size={16} style={{ marginRight: "0.5rem" }} />
        Logout
      </button>
      </span>
    </nav>
  );
}