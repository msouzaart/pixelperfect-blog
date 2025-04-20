// components/ResetPasswordModal.jsx
import React from "react";

export default function ResetPasswordModal({
  resetEmail,
  setResetEmail,
  handlePasswordReset,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Redefinir senha</h3>
        <p>Digite seu e‑mail para receber o link de redefinição:</p>
        <input
          type="email"
          placeholder="Seu e‑mail"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          required
        />
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancelar
          </button>
          <button onClick={handlePasswordReset} className="btn-send">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
