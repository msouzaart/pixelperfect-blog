// Modal.js
import React from "react";

export default function Modal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>{title}</h2>
        <p style={{ marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #888",
              background: "transparent",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.5rem 1rem",
              background: "rgb(220, 53, 69)",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
} 
