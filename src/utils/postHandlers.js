// utils/postHandlers.js
import { toast } from "react-toastify";
import { createPost, updatePost, getPostById } from "./firebaseUtils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const carregarPostExistente = async (
  id,
  setTitulo,
  setConteudo,
  setImagemCapa,
  setTagsString,
  navigate
) => {
  try {
    const post = await getPostById(id);
    if (post) {
      setTitulo(post.titulo || "");
      setConteudo(post.conteudo || "");
      setImagemCapa(post.imagemCapa || null);
      setTagsString((post.tags || []).join(", "));
    } else {
      toast.error("Post não encontrado.");
      navigate("/");
    }
  } catch (error) {
    toast.error("Erro ao carregar o post.");
    console.error(error);
    navigate("/");
  }
};

export const salvarRascunho = (setLastSavedAt) => {
  const now = new Date();
  setLastSavedAt(now);
  toast.success("Rascunho salvo!");
};

export const alternarVisualizacao = (setVisualizar) => {
  setVisualizar((prev) => !prev);
};

export const publicarPost = async ({
  isEditing,
  id,
  titulo,
  conteudo,
  imagemCapa,
  tagsString,
  navigate,
}) => {
  if (!titulo || !conteudo) {
    toast.error("Título e conteúdo são obrigatórios.");
    return;
  }

  try {
    console.log("Iniciando publicação do post...");
    console.log("Dados do post:", { titulo, conteudo, imagemCapa, tagsString });

    let imagemCapaUrl = null;
    if (imagemCapa && imagemCapa instanceof File) {
      console.log("Enviando imagem de capa...");
      const storage = getStorage();
      const storageRef = ref(storage, `capa/${imagemCapa.name}-${Date.now()}`);
      await uploadBytes(storageRef, imagemCapa);
      imagemCapaUrl = await getDownloadURL(storageRef);
      console.log("Imagem de capa enviada. URL:", imagemCapaUrl);
    } else if (typeof imagemCapa === "string") {
      imagemCapaUrl = imagemCapa;
      console.log("Imagem de capa já é uma URL:", imagemCapaUrl);
    }

    const postData = {
      titulo,
      conteudo,
      imagemCapa: imagemCapaUrl,
      tags: tagsString.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    console.log("Dados finais do post:", postData);

    if (isEditing) {
      console.log("Atualizando post com ID:", id);
      await updatePost(id, postData);
      toast.success("Post atualizado com sucesso!");
    } else {
      console.log("Criando novo post...");
      const newId = await createPost(postData);
      console.log("Post criado com ID:", newId);
      toast.success("Post publicado com sucesso!");
      navigate(`/editar/${newId}`);
      return;
    }
    navigate("/");
  } catch (error) {
    console.error("Erro ao publicar o post:", error);
    toast.error("Erro ao publicar o post: " + error.message);
  }
};