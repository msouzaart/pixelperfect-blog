import React from "react";

export default function HeaderButtons({
  handleSalvar,
  handleVisualizar,
  handlePublish,
  lastSavedAt,
  isEditing,
}) {
  return (
    <div className="header-buttons">
      <button onClick={handleSalvar}>Salvar rascunho</button>
      <button onClick={handleVisualizar}>
        {isEditing ? "Atualizar visualização" : "Visualizar"}
      </button>
      <button onClick={handlePublish}>
        {isEditing ? "Atualizar post" : "Publicar"}
      </button>
      {lastSavedAt && <small>Último salvamento: {lastSavedAt.toLocaleTimeString()}</small>}
    </div>
  );
}
