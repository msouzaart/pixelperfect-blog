// src/pages/Contact.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HeaderBlog from "../components/HeaderBlog";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage("Please enter a valid email.");
      return;
    }
    if (!formData.name || !formData.subject || !formData.message) {
      setMessage("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await emailjs.send(
        "service_zy3qsup",
        "template_j17bcpo", // Update if new template
        formData,
        "b4GSmlKLAVcSnlQ3A"
      );
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contactPage">
      <HeaderBlog />
      <section className="contactSection" aria-labelledby="contact-heading">
        <div className="BackButtonContainer">
          <Link to="/blog" className="backButton" aria-label="Back to blog">
            Back to Blog
          </Link>
        </div>

        <div className="containerContact">
          <h1 id="contact-heading">Get in Touch!</h1>
          <p>
            We’d love to hear from you! Drop us a message, and we’ll get back to
            you within 24 hours.
          </p>
          {!isSubmitted ? (
            <form
              className="contactForm"
              onSubmit={handleSubmit}
              aria-describedby="contact-error"
            >
              <label htmlFor="name-input" className="sr-only">
                Name
              </label>
              <input
                id="name-input"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="newsletterInput"
                required
              />
              <label htmlFor="email-input" className="sr-only">
                Email address
              </label>
              <input
                id="email-input"
                type="email"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                className="newsletterInput"
                required
              />
              <label htmlFor="subject-input" className="sr-only">
                Subject
              </label>
              <input
                id="subject-input"
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="newsletterInput"
                required
              />
              <label htmlFor="message-input" className="sr-only">
                Message
              </label>
              <textarea
                id="message-input"
                name="message"
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                className="newsletterInput"
                rows="5"
                required
              />
              <button
                type="submit"
                className="newsletterButton"
                disabled={isLoading}
                aria-busy={isLoading ? "true" : "false"}
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
              {message && (
                <p
                  id="contact-error"
                  className="newsletterMessage"
                  role="alert"
                >
                  {message}
                </p>
              )}
            </form>
          ) : (
            <div className="successMessage" role="alert">
              <p>
                We’ve got your message! Thanks for reaching out — expect a reply
                from us soon!
              </p>
              <button
                className="newsletterButton"
                onClick={() => setIsSubmitted(false)}
                aria-label="Send another message"
              >
                Send Another Message
              </button>
              <Link to="/blog" className="backButton" aria-label="Back to blog">
                Back to Blog
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
