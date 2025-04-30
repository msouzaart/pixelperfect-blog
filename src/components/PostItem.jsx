import React from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

export default function PostItem({ post, onDelete, onPrincipalChange }) {
  const navigate = useNavigate();

  return (
    <li className="ItemListDash" key={post.id}>
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

      <span className="descCard">
        <h3 style={{ margin: "0.75rem 0 0.5rem" }}>{post.titulo}</h3>
        <small style={{ color: "#888" }}>
          {post.createdAt?.toDate?.().toLocaleString() || ""}
        </small>
      </span>

      <div className="buttonCard">
        <button
          className="editBtn"
          onClick={() => navigate(`/create-post/${post.id}`)}
        >
          <Pencil size={20} />
          Edit
        </button>

        <button className="deleteBtn" onClick={() => onDelete(post.id)}>
          <Trash2 size={20} />
          Deletar
        </button>

        <label className="principalBtn">
          <input
            type="radio"
            checked={post.principal}
            onChange={() => onPrincipalChange(post.id, post.principal)}
          />
          Post Principal
        </label>
      </div>
    </li>
  );
}
