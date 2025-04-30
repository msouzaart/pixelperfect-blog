// src/components/ImageUpload.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import upload from "../assets/upload.svg";

export default function ImageUpload({ imagemCapa, setImagemCapa }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (imagemCapa && typeof imagemCapa === "string") {
      setPreview(imagemCapa);
    } else if (imagemCapa && imagemCapa instanceof File) {
      const previewUrl = URL.createObjectURL(imagemCapa);
      setPreview(previewUrl);
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    } else {
      setPreview(null);
    }
  }, [imagemCapa]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagemCapa(file);
    } else {
      toast.error("Por favor, selecione uma imagem válida.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagemCapa(file);
    } else {
      toast.error("Por favor, solte uma imagem válida.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="upload-box"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />

      <label
        htmlFor="fileInput"
        className="upload-label"
        style={{ cursor: "pointer" }}
      >
        {preview ? (
          <img src={preview} alt="Prévia" className="preview-img" />
        ) : (
          <span className="imageUpload">
            <img src={upload} alt="Upload Icon" />

            <p>
              <strong>Selecione um arquivo para upload</strong> ou arraste e
              solte aqui
            </p>
          </span>
        )}
      </label>
    </div>
  );
}
