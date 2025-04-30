// src/pages/CreatePost.jsx - Corrigido
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PostEditor from "../components/PostEditor";
import ImageUpload from "../components/ImageUpload";
import {
  carregarPostExistente,
  salvarRascunho,
  alternarVisualizacao,
  publicarPost,
} from "../utils/postHandlers";
import { FiEye, FiSave, FiSend, FiEdit } from "react-icons/fi";

export default function CreatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemCapa, setImagemCapa] = useState(null);
  const [tagsString, setTagsString] = useState("");
  const [visualizar, setVisualizar] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const editorRef = useRef(null);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      carregarPostExistente(
        id,
        setTitulo,
        setConteudo,
        setImagemCapa,
        setTagsString,
        navigate
      );
    }
  }, [id, isEditing, navigate]);

  const handleSalvarRascunho = () => {
    salvarRascunho(setLastSavedAt);
  };

  const handlePublicar = async () => {
    await publicarPost({
      isEditing,
      id,
      titulo,
      conteudo,
      imagemCapa,
      tagsString,
      navigate,
    });
  };

  const handleAlternarVisualizacao = () => {
    alternarVisualizacao(setVisualizar);
  };

  return (
    <div className="CreatePost">
      <section className="CreatePostHeader">
        <h1>{isEditing ? "Editar Post" : "Criar Novo Post"}</h1>
        <div className="btnCreatePost">
          <button onClick={handleAlternarVisualizacao}>
            {visualizar ? <FiEdit /> : <FiEye />}
            {visualizar ? " Editar" : " Visualizar"}
          </button>
          <button onClick={handleSalvarRascunho}>
            <FiSave /> Salvar Rascunho
          </button>
          <button onClick={handlePublicar}>
            <FiSend /> Publicar
          </button>
        </div>
      </section>
      {lastSavedAt && (
        <p>Último rascunho salvo: {lastSavedAt.toLocaleString()}</p>
      )}

      <div className="TituloPost">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título do post"
        />
      </div>
      <ImageUpload imagemCapa={imagemCapa} setImagemCapa={setImagemCapa} />
      <div>
        <input className="Tags"
          type="text"
          value={tagsString}
          onChange={(e) => setTagsString(e.target.value)}
          placeholder="Tags (separadas por vírgula)"
        />
      </div>
      <PostEditor
        conteudo={conteudo}
        setConteudo={setConteudo}
        editorRef={editorRef}
        visualizar={visualizar}
      />

      <section className="visualizarContainer">
      {visualizar && (
        <div className="visualizar"
          dangerouslySetInnerHTML={{ __html: conteudo }}
        />
      )}
      </section>
    </div>
  );
}