// src/components/HeaderBlog.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoBlog from "../assets/logo horizontal.png";

export default function HeaderBlog() {
  const navigate = useNavigate();

  return (
    <header className="headerBlog">
      <div aria-label="Pixel Perfect Marcela Home">
        <img
          src={logoBlog}
          alt="Pixel Perfect Marcela Logo"
          className="logoClickable"
          onClick={() => navigate("/blog")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/blog");
            }
          }}
        />
      </div>
      <nav aria-label="Main navigation">
        <ul className="naveHeader">
          <li>
            <Link to="/contact" aria-label="Contact us" className="navLink">
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}