// src/components/PostPreview.jsx
import React from "react";

export default function PostPreview({ titulo, conteudo, imagemCapa }) {
  return (
    <div className="post-preview p-6 max-w-4xl mx-auto font-sans">
      {imagemCapa && (
        <img
          src={imagemCapa}
          alt="Imagem de capa"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-4xl font-bold mb-6">{titulo}</h1>
      <div
        className="prose prose-lg max-w-3xl mx-auto"
        dangerouslySetInnerHTML={{ __html: conteudo }}
      />
    </div>
  );
}