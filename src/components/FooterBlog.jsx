// src/components/Footer.jsx
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function FooterBlog() {
  return (
    <footer className="containerFooter" aria-label="Footer">
      <section className="FooterContact">
        <h2>Contact us</h2>
        <a href="mailto:contact@pixelperfectmarcela.com" aria-label="Email us at contact@pixelperfectmarcela.com">
          contact@pixelperfectmarcela.com
        </a>
      </section>
      <section className="FooterSocialMedia">
        <h2>Follow us</h2>
        <ul>
          <li>
            <a
              href="https://www.linkedin.com/in/seu-perfil"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our LinkedIn profile"
            >
              <FaLinkedin size={28} />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/seu-perfil"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram profile"
            >
              <FaInstagram size={28} />
            </a>
          </li>
        </ul>
      </section>
    </footer>
  );
}