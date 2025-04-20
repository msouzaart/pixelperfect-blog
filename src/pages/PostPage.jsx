// src/pages/PostPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("Documento não encontrado.");
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div className="p-6">Carregando post...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <button
        onClick={() => navigate("/blog")}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ← Voltar para o blog
      </button>

      <div className="containerPost">
      {post.imagemCapa && (
        <img
          src={post.imagemCapa}
          alt="Imagem de capa"
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-6 postTitulo">{post.titulo}</h1>

      <div
        className="prose prose-lg max-w-3xl mx-auto post"
        dangerouslySetInnerHTML={{ __html: post.conteudo }}
      />
      </div>

      <div dangerouslySetInnerHTML={{ __html: post.conteudo }} />
      <p><strong>Tags:</strong> {post.tags?.join(", ")}</p>


    </div>
  );
};

export default PostPage;
