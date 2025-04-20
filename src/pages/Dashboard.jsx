// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Busca posts publicados, ordenados por data de criação descendente
  useEffect(() => {
    (async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar este post?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Erro ao deletar o post:", error);
      alert("Ocorreu um erro ao deletar o post.");
    }
  };


// Handle toggle post principal
const handlePrincipalChange = async (id, isPrincipal) => {
  if (isPrincipal) return; // Se já é principal, não faz nada.

  const postRef = doc(db, "posts", id);
  await updateDoc(postRef, { principal: true });

  // Desmarcando todos os outros posts como principal
  const allPosts = posts.filter(post => post.id !== id);
  await Promise.all(
    allPosts.map((post) =>
      updateDoc(doc(db, "posts", post.id), { principal: false })
    )
  );

  setPosts(posts.map((post) => post.id === id ? { ...post, principal: true } : { ...post, principal: false }));
};

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>Dashboard</h1>

      {/* Botões de ação */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => navigate("/create-post")}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Novo Post
        </button>

        <button
          onClick={() => navigate("/blog")}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Ver Blog
        </button>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: "auto",
            padding: "0.6rem 1.2rem",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>

      {/* Lista de posts */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li
            key={post.id}
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            {post.imagemCapa && (
              <img
                src={post.imagemCapa}
                alt={post.titulo}
                style={{
                  width: "100%",
                  maxHeight: "20vh",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            )}
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "1rem" }}>
              <button
                onClick={() => navigate(`/create-post/${post.id}`)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Editar / Visualizar
              </button>

              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Deletar
              </button>
              <label>
                <input
                  type="radio"
                  checked={post.principal}
                  onChange={() => handlePrincipalChange(post.id, post.principal)}
                />
                Post Principal
              </label>


            </div>
            <h3 style={{ margin: "0.75rem 0 0.5rem" }}>{post.titulo}</h3>
            <small style={{ color: "#888" }}>
              {post.createdAt?.toDate?.().toLocaleString() || ""}
            </small>

          </li>
        ))}
      </ul>
    </div>
  );
}
