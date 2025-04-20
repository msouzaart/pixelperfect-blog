import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const Blog = () => {
  const [principalPost, setPrincipalPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const posts = [];

      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });

      const main = posts.find((post) => post.principal === true);
      const others = posts
        .filter((post) => post.principal !== true)
        .slice(0, 4); // só 4 posts

      setPrincipalPost(main);
      setOtherPosts(others);
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna principal (ocupa 2/3) */}
        {principalPost && (
          <div className="md:col-span-2">
            <Link to={`/blog/${principalPost.id}`}>
              <div className="bg-gray-100 shadow rounded-lg overflow-hidden hover:shadow-xl transition">
                {principalPost.imagemCapa && (
                  <img
                    src={principalPost.imagemCapa}
                    alt={principalPost.titulo}
                    className="w-full h-96 object-cover"
                  />
                )}
                <div className="p-6">
                  <span className="text-sm text-blue-800 font-semibold">
                    UX/UI
                  </span>
                  <h2 className="text-3xl font-semibold mb-2 mt-1">
                    {principalPost.titulo}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {stripHtml(principalPost.conteudo).slice(0, 200)}...
                  </p>
                  <p className="mt-4 text-blue-600 font-medium">Ler mais →</p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Coluna dos 4 posts (2x2) */}
        <div className="grid grid-cols-2 gap-4">
          {otherPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id}>
              <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
                {post.imagemCapa && (
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                      src={post.imagemCapa}
                      alt={post.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-3">
                  <span className="text-xs text-blue-800 font-semibold block mb-1">
                    UX/UI
                  </span>
                  <h3 className="text-md font-bold leading-tight">
                    {post.titulo}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
