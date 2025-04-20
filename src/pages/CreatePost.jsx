// src/pages/CreatePost.jsx
import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export default function CreatePost() {
  const { id } = useParams(); // se houver :id, estamos editando
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemCapa, setImagemCapa] = useState(null);
  const [visualizar, setVisualizar] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [tagsString, setTagsString] = useState(""); // tags como texto separado por vírgula
  const storage = getStorage();

  // Carrega dados existentes para edição
  useEffect(() => {
    if (!isEditing) return;
    carregarPostExistente();
  }, [id]);

  async function carregarPostExistente() {
    try {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        toast.error("Post não encontrado");
        return navigate("/dashboard");
      }
      const data = snap.data();
      setTitulo(data.titulo || "");
      setConteudo(data.conteudo || "");
      setImagemCapa(data.imagemCapa || null);
      setTagsString(data.tags ? data.tags.join(", ") : "");
    } catch (err) {
      toast.error("Erro ao carregar post: " + err.message);
    }
  }

  const handleSalvar = () => {
    setLastSavedAt(new Date());
    toast.info("Rascunho salvo localmente");
  };

  const handleVisualizar = () => {
    // Sincroniza o último conteúdo do editor antes de visualizar
    const latest = editorRef.current?.getContent() || conteudo;
    setConteudo(latest);
    setVisualizar((v) => !v);
  };

  const handlePublish = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      toast.error("Título e conteúdo são obrigatórios");
      return;
    }
    const tagsArray = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      if (isEditing) {
        const ref = doc(db, "posts", id);
        await updateDoc(ref, {
          titulo,
          conteudo,
          imagemCapa,
          tags: tagsArray,
          updatedAt: serverTimestamp(),
        });
        toast.success("Post atualizado!");
      } else {
        await addDoc(collection(db, "posts"), {
          titulo,
          conteudo,
          imagemCapa,
          tags: tagsArray,
          createdAt: serverTimestamp(),
        });
        toast.success("Post criado!");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error("Erro ao publicar: " + err.message);
    }
  };

  const handleImageCapaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagemCapa(reader.result);
    reader.readAsDataURL(file);
  };

  

  return (
    <div className="create-post-container" style={{ padding: "2rem" }}>
      {/* Botão voltar */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          background: "none",
          border: "none",
          fontSize: "1rem",
          color: "#007bff",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        ← Voltar para o Dashboard
      </button>

      {/* Header com botões */}
      <div
        className="post-header"
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
      >
        <button type="button" onClick={handleSalvar}>
          Salvar
        </button>
        {lastSavedAt && (
          <div
            className="save-info"
            style={{ alignSelf: "center", fontSize: "0.9rem" }}
          >
            Último rascunho: {lastSavedAt.toLocaleString()}
          </div>
        )}
        <button type="button" onClick={handleVisualizar}>
          {visualizar ? "Fechar visualização" : "Visualizar"}
        </button>
        <button type="button" onClick={handlePublish}>
          {isEditing ? "Atualizar" : "Publicar"}
        </button>
      </div>

      {/* Upload da imagem de capa */}
      <div className="upload-capa" style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="capa-input"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          Upload imagem de capa:
        </label>
        <input
          id="capa-input"
          type="file"
          accept="image/*"
          onChange={handleImageCapaUpload}
        />
        {imagemCapa && (
          <div style={{ marginTop: "1rem" }}>
            <img
              src={imagemCapa}
              alt="Imagem de capa"
              style={{
                width: "100%",
                maxHeight: "40vh",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
      </div>

      {/* Campo de Título */}
      <input
        type="text"
        className="input-titulo"
        placeholder="Título do post"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        style={{
          width: "100%",
          fontSize: "4.5rem",
          padding: "0.5rem",
          marginBottom: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* Campo de Tags */}
      <input
        type="text"
        placeholder="Tags (separadas por vírgula)"
        value={tagsString}
        onChange={(e) => setTagsString(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      {/* Editor TinyMCE */}
      <Editor
        apiKey="2ngmlqomnasqjcpbm8ra99mcefs0eici0cw21yvk0c0i0myc"
        value={conteudo}
        onEditorChange={(content) => setConteudo(content)}
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          directionality: "ltr",
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "advtable",
            "advcode",
            "editimage",
            "mentions",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
            "link image media | alignleft aligncenter alignright | bullist numlist outdent indent | " +
            "removeformat",
          content_style: `
            body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              max-width: 800px;
              margin: 2rem auto;
            }
            figure { text-align: center; margin: 1em auto; }
            figcaption { font-size: 0.9rem; font-style: italic; color: #666; text-align: center; }
          `,
          file_picker_types: "image",
          file_picker_callback: (cb, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async () => {
                const file = input.files[0];

                if (file) {
                  const storageRef = ref(
                    storage,
                    `images/${file.name}-${Date.now()}`
                  );
                  await uploadBytes(storageRef, file);
                  const downloadURL = await getDownloadURL(storageRef);

                  const caption = prompt(
                    "Digite a legenda da imagem:",
                    "Legenda da imagem"
                  );
                  const html = `
                    <figure style="margin: 2rem 0;">
                      <img src="${downloadURL}" alt="${caption}"
                           style="width: 100%; height: auto; max-height: 40vh; object-fit: contain;" />
                      <figcaption style="font-size: 0.9rem; font-style: italic; color: #666; text-align: center;">
                        ${caption}
                      </figcaption>
                    </figure><p></p>
                  `;
                  window.tinymce.activeEditor.insertContent(html);
                }
              };
              input.click();
            }
          },
        }}
      />

      {/* Visualização do post */}
      {visualizar && (
        <div
          className="preview"
          style={{
            marginTop: "3rem",
            padding: "1rem",
            background: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h2>Visualização</h2>
          {imagemCapa && (
            <img
              src={imagemCapa}
              alt="Imagem de capa"
              style={{
                width: "100%",
                maxHeight: "40vh",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            />
          )}
          <h3 className="tituloVisualizacao">{titulo}</h3>
          <div dangerouslySetInnerHTML={{ __html: conteudo }} />
        </div>
      )}
    </div>
  );
}
