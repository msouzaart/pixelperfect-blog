// src/pages/Blog.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../blog.css"; // Add this line
import { Link } from "react-router-dom";
import HeaderBlog from "../components/HeaderBlog";
import OtherPosts from "../components/OtherPosts.jsx";
import PopularPosts from "../components/PopularPosts.jsx";
import NewsletterSection from "../components/NewsletterSection.jsx";
import FooterBlog from "../components/FooterBlog.jsx";

const Blog = () => {
  const [principalPost, setPrincipalPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts = [];

        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });

        const main = posts.find((post) => post.principal === true);
        setPrincipalPost(main);

        const others = posts.filter((post) => post.principal !== true).slice(0, 4);
        setOtherPosts(others);

        const popular = posts.filter((post) => post.principal !== true).slice(4);
        setPopularPosts(popular);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Pixel Perfect Marcela Blog",
    description: "Weekly updates on UX/UI design, case studies, and tips.",
    url: "https://pixelperfectmarcela.com/blog",
    blogPost: principalPost
      ? [
          {
            "@type": "BlogPosting",
            headline: principalPost.titulo,
            image: principalPost.imagemCapa,
            datePublished: principalPost.createdAt || new Date().toISOString(),
            description: stripHtml(principalPost.conteudo).slice(0, 160),
            author: {
              "@type": "Person",
              name: "Marcela",
            },
          },
        ]
      : [],
  };

  return (
    <>
      <meta
        name="description"
        content="Explore weekly UX/UI design stories, case studies, and tips on the Pixel Perfect Marcela blog."
      />
      <meta
        name="keywords"
        content="UX design, UI design, blog, case studies, design tips"
      />
      <meta property="og:title" content="Pixel Perfect Marcela Blog" />
      <meta
        property="og:description"
        content="Weekly updates on UX/UI design, case studies, and tips."
      />
      <meta
        property="og:image"
        content={principalPost?.imagemCapa || "/default-image.jpg"}
      />
      <meta property="og:url" content="https://pixelperfectmarcela.com/blog" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <main className="blogContainer" aria-labelledby="blog-heading">
        <h1 id="blog-heading" className="sr-only">
          Pixel Perfect Marcela Blog
        </h1>
        <HeaderBlog />
        <section className="blogGrid" aria-label="Blog posts">
          {principalPost && (
            <article className="principalPost">
              <Link to={`/${principalPost.id}`} aria-label={`Read ${principalPost.titulo}`}>
                <div className="postCardPrincipal">
                  {principalPost.imagemCapa && (
                    <img
                      src={principalPost.imagemCapa}
                      alt={`Featured image for ${principalPost.titulo}`}
                      className="postImage principalImage"
                    />
                  )}
                  <div className="postContent">
                    <span className="postCategoryPrincipal">UX/UI</span>
                    <h2 className="postTitlePrincipal">{principalPost.titulo}</h2>
                    <p className="postExcerpt">
                      {stripHtml(principalPost.conteudo).slice(0, 130)}...
                    </p>
                    <span className="readMore">Read more</span>
                  </div>
                </div>
              </Link>
            </article>
          )}
          <OtherPosts posts={otherPosts} />
        </section>
        {popularPosts.length > 0 && (
          <PopularPosts posts={popularPosts} stripHtml={stripHtml} />
        )}
        <NewsletterSection />
        <FooterBlog />
      </main>
    </>
  );
};

export default Blog;