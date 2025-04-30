// src/components/PopularPosts.jsx
import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PopularPosts({ posts, stripHtml }) {
  const sliderSettings = {
    dots: true,
    infinite: posts.length > 3,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    accessibility: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="popularSection" aria-labelledby="popular-heading">
      <h2 id="popular-heading">Trending Now 🔥</h2>
      <Slider {...sliderSettings} className="popularPosts" aria-label="Popular posts carousel">
        {posts.map((post) => (
          <article key={post.id} className="postCardPopular">
            <Link to={`/${post.id}`} aria-label={`Read ${post.titulo}`}>
              {post.imagemCapa && (
                <img
                  src={post.imagemCapa}
                  alt={`Image for ${post.titulo}`}
                  className="postImage"
                />
              )}
              <div className="postContent">
                <span className="postCategory">UX/UI</span>
                <h3 className="postTitle">{post.titulo}</h3>
                <p className="postExcerpt">
                  {stripHtml(post.conteudo).slice(0, 100)}...
                </p>
              </div>
            </Link>
          </article>
        ))}
      </Slider>
    </section>
  );
}