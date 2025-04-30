import React from "react";
import { Link } from "react-router-dom";

export default function OtherPosts({ posts }) {
  return (
    <section className="otherPosts" aria-label="Other blog posts">
      {posts.map((post) => (
        <article key={post.id} className="postCard">
          <Link to={`/${post.id}`} aria-label={`Read ${post.titulo}`}>
            {post.imagemCapa && (
              <img
                src={post.imagemCapa}
                alt={`Image for ${post.titulo}`}
                className="postImage"
              />
            )}
            <div className="postContent">
              <span className="postCategoryOther">UX/UI</span>
              <h3 className="postTitle">{post.titulo}</h3>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}