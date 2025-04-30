// src/pages/PostPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import HeaderBlog from "../components/HeaderBlog";
import FooterBlog from "../components/FooterBlog";
import PopularPosts from "../components/PopularPosts";
import "../blog.css";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [popularPosts, setPopularPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postDescription, setPostDescription] = useState("");
  const [structuredData, setStructuredData] = useState({});
  const [readingTime, setReadingTime] = useState(1);
  const [formattedDate, setFormattedDate] = useState("Data não disponível");

  // Function to strip HTML for SEO descriptions
  function stripHtml(html) {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  // Calculate reading time based on content length
  const calculateReadingTime = (content) => {
    if (!content) return 1;
    const plainText = content.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  // Fetch post and related data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Get main post
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = { id: docSnap.id, ...docSnap.data() };
          setPost(postData);

          // Compute derived values
          const calculatedReadingTime = calculateReadingTime(postData.conteudo);
          setReadingTime(calculatedReadingTime);

          const formattedDateValue = postData.dataPublicacao?.toDate
            ? postData.dataPublicacao.toDate().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : "Data não disponível";
          setFormattedDate(formattedDateValue);

          const description = stripHtml(postData.conteudo).slice(0, 160);
          setPostDescription(description);

          const postUrl = window.location.href;
          const structuredDataObj = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": postData.titulo,
            "image": postData.imagemCapa || "",
            "datePublished": postData.dataPublicacao?.toDate
              ? postData.dataPublicacao.toDate().toISOString()
              : new Date().toISOString(),
            "dateModified": postData.dataModificacao?.toDate
              ? postData.dataModificacao.toDate().toISOString()
              : new Date().toISOString(),
            "author": {
              "@type": "Person",
              "name": postData.autor?.nome || "Marcela",
            },
            "publisher": {
              "@type": "Organization",
              "name": "Pixel Perfect Marcela",
              "logo": {
                "@type": "ImageObject",
                "url": "https://pixelperfectmarcela.com/logo.png",
              },
            },
            "description": description,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": postUrl,
            },
          };
          setStructuredData(structuredDataObj);

          // Fetch all posts for related posts
          const postsRef = collection(db, "posts");
          const postsSnapshot = await getDocs(postsRef);
          const allPosts = postsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter related posts
          const currentTags = Array.isArray(postData.tags) ? postData.tags : [];
          let related = allPosts
            .filter(p =>
              p.id !== id &&
              Array.isArray(p.tags) &&
              p.tags.some(tag => currentTags.includes(tag))
            )
            .slice(0, 3);

          // Fallback: if no related posts, get 3 random posts
          if (related.length === 0) {
            related = allPosts.filter(p => p.id !== id).slice(0, 3);
          }
          setRelatedPosts(related);
          console.log("Related Posts:", related);

          // Fetch popular posts
          const popularPostsQuery = query(
            collection(db, "posts"),
            orderBy("visualizacoes", "desc"),
            limit(5)
          );
          const popularSnapshot = await getDocs(popularPostsQuery);
          let popularData = popularSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fallback: if no popular posts, get 5 random posts
          if (popularData.length === 0) {
            const fallbackSnapshot = await getDocs(collection(db, "posts"));
            popularData = fallbackSnapshot.docs
              .map(doc => ({
                id: doc.id,
                ...doc.data(),
              }))
              .slice(0, 5);
          }
          setPopularPosts(popularData);
          console.log("Popular Posts:", popularData);
        } else {
          console.log("Documento não encontrado.");
          setError("Post não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar post:", error);
        setError("Erro ao carregar o post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  // Set document title and meta tags
  useEffect(() => {
    if (!post) return;

    document.title = `${post.titulo} | Pixel Perfect Marcela`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', postDescription);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = postDescription;
      document.head.appendChild(metaDescription);
    }

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.textContent = JSON.stringify(structuredData);
    } else {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const script = document.querySelector('script[type="application/ld+json"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [post, postDescription, structuredData]);

  // Loading component
  const renderLoading = () => (
    <>
      <HeaderBlog />
      <div className="p-6 text-center" aria-live="polite">
        <div role="status">
        Summoning your post... please stand by!
          <span className="sr-only">Hang tight! Your awesome content is on its way..</span>
        </div>
      </div>
      <FooterBlog />
    </>
  );

  // Error component
  const renderError = () => (
    <>
      <HeaderBlog />
      <div className="p-6 text-center" aria-live="assertive" role="alert">
        {error || "Post não encontrado"}
        <div className="mt-4">
          <Link
            to="/blog"
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Back to Blog
          </Link>
        </div>
      </div>
      <FooterBlog />
    </>
  );

  // Main content component
  const renderContent = () => (
    <>
      <HeaderBlog />
      <main className="blogContainer" aria-labelledby="post-heading">
        <div className="postNavigation">
          <button
            onClick={() => navigate("/")}
            className="backButtonPost"
            aria-label="Voltar para a página do blog"
          >
           Back to Blog
          </button>
        </div>

        <div className="postWrapper">
          {/* Main Content Column */}
          <article className="postMain">
            <header>
              <div className="postMeta" aria-label="Informações do post">
                {post.tags && post.tags.length > 0 && (
                  <span className="postTag" aria-label="Categoria do post">
                    {post.tags[0]}
                  </span>
                )}
                <div className="postDate">
                  <time dateTime={post.dataPublicacao?.toDate?.().toISOString()}>
                    {formattedDate}
                  </time>
                  <span aria-label="Tempo estimado de leitura">
                    • Read in {readingTime} min
                  </span>
                </div>
              </div>
              <h1 id="post-heading" className="postTitle">{post.titulo}</h1>
              {post.subtitulo && <h2 className="postSubtitle">{post.subtitulo}</h2>}
            </header>

            {post.imagemCapa && (
              <figure className="postCoverImage">
                <img
                  src={post.imagemCapa}
                  alt={`Imagem ilustrativa para o artigo: ${post.titulo}`}
                  className="coverImage"
                />
              </figure>
            )}

            <div
              className="postContent"
              dangerouslySetInnerHTML={{ __html: post.conteudo }}
            />

            {/* Tags section */}
            {post.tags && post.tags.length > 0 && (
              <div className="postTags" aria-label="Tags do post">
                <strong>Tags:</strong>
                <ul className="tagsList">
                  {post.tags.map((tag, index) => (
                    <li key={index} className="tagItem">
                      <Link to={`/blog/tag/${encodeURIComponent(tag)}`} className="tagLink">
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Posts */}
            {/* <section className="relatedSection" aria-labelledby="related-posts-heading">
              <h2 id="related-posts-heading" className="sr-only">You Might Also Like...</h2>
              {relatedPosts.length > 0 ? (
                <PopularPosts
                  posts={relatedPosts}
                  stripHtml={stripHtml}
                  title="You Might Also Like..."
                  sectionId="related-posts-heading"
                />
              ) : (
                <p>Any related post found</p>
              )}
            </section> */}
          </article>

          {/* Sidebar - Popular Posts */}
          <aside className="postSidebar">
            <div className="sidebarSticky">
              <h3 id="popular-posts-heading" className="sidebarTitle">Reader Faves</h3>
              {popularPosts.length > 0 ? (
                <ul className="popularPostsList" aria-labelledby="popular-posts-heading">
                  {popularPosts.map(popularPost => (
                    <li key={popularPost.id} className="popularPostItem">
                      <Link
                        to={`/blog/${popularPost.id}`}
                        className="popularPostLink"
                        aria-label={`Ler o artigo popular: ${popularPost.titulo}`}
                      >
                        {popularPost.imagemCapa && (
                          <div className="popularPostImageContainer">
                            <img
                              src={popularPost.imagemCapa}
                              alt={`Imagem para ${popularPost.titulo}`}
                              className="popularPostImage"
                            />
                          </div>
                        )}
                        <h4 className="popularPostTitle">{popularPost.titulo}</h4>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No post found</p>
              )}
            </div>
          </aside>
        </div>
      </main>
      <FooterBlog />
    </>
  );

  // Conditional rendering
  if (loading) return renderLoading();
  if (error || !post) return renderError();
  return renderContent();
};

export default PostPage;