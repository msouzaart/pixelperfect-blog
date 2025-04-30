// src/components/NewsletterSection.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isOptIn, setIsOptIn] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }
    if (!isOptIn) {
      setMessage("Please agree to receive emails.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await emailjs.send(
        "service_zy3qsup",
        "template_j17bcpo", // Adjust if different
        { email },
        "b4GSmlKLAVcSnlQ3A"
      );
      setEmail("");
      setIsOptIn(false);
      setShowPopup(true);
    } catch (error) {
      console.error("Error subscribing:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <section className="newsletterSection" aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading">Join Our Blog Community!</h2>
      <p>
        Subscribe to get the latest posts, tips, and updates straight to your
        inbox.
      </p>
      <form
        className="newsletterForm"
        onSubmit={handleSubmit}
        aria-describedby="newsletter-error"
      >
        <span className="newletterInputEmail">
        <label htmlFor="email-input" className="sr-only">
          Email address
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="newsletterInput"
          required
        />
        <button
          type="submit"
          className="newsletterButton"
          disabled={isLoading}
          aria-busy={isLoading ? "true" : "false"}
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button> 
        </span>
        <div className="optInContainer">
          <input
            id="opt-in"
            type="checkbox"
            checked={isOptIn}
            onChange={(e) => setIsOptIn(e.target.checked)}
            required
          />
          <label htmlFor="opt-in">
            I agree to receive emails and accept the{" "}
            <Link to="/privacy-policy" className="privacyLink">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {message && (
          <p id="newsletter-error" className="newsletterMessage" role="alert">
            {message}
          </p>
        )}
      </form>
      {showPopup && (
        <div
          className="popupOverlay"
          role="dialog"
          aria-labelledby="popup-heading"
        >
          <div className="popupContent">
            <h3 id="popup-heading">Welcome to the Crew!</h3>
            <p>
              You’re now part of our vibrant blog community! Expect exciting
              posts, exclusive tips, and updates delivered right to your inbox.
              Thanks for joining us!
            </p>
            <button
              className="newsletterButton"
              onClick={closePopup}
              aria-label="Close subscription success popup"
            >
              Awesome, Got It!
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
