import React, { useState, useEffect } from "react";
import "../index.css"; // Add this line

import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import DashboardActions from "../components/DashboardActions";
import PostItem from "../components/PostItem";
import Modal from "../components/Modal";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const navigate = useNavigate();

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

  const handleDelete = (postId) => {
    setSelectedPostId(postId);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, "posts", selectedPostId));
      setPosts((prev) => prev.filter((post) => post.id !== selectedPostId));
    } catch (error) {
      console.error("Erro ao deletar o post:", error);
      alert("Erro ao deletar o post.");
    } finally {
      setModalOpen(false);
      setSelectedPostId(null);
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setSelectedPostId(null);
  };

  const handlePrincipalChange = async (id, isPrincipal) => {
    if (isPrincipal) return;

    await updateDoc(doc(db, "posts", id), { principal: true });

    const outrosPosts = posts.filter((post) => post.id !== id);
    await Promise.all(
      outrosPosts.map((post) =>
        updateDoc(doc(db, "posts", post.id), { principal: false })
      )
    );

    setPosts(
      posts.map((post) =>
        post.id === id
          ? { ...post, principal: true }
          : { ...post, principal: false }
      )
    );
  };

  return (
    <main className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="title-divider" role="presentation" />
      <DashboardActions onLogout={handleLogout} />
      <section aria-label="Lista de posts">
        <ul className="post-list">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onPrincipalChange={handlePrincipalChange}
            />
          ))}
        </ul>
      </section>

      <Modal
        open={modalOpen}
        title="Confirmar Exclusão"
        message="Tem certeza de que deseja apagar este post?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </main>
  );
}
