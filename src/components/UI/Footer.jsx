import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "./Footer.css";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      {/* Social Media Icons */}
      <div className="footer-social-icons text-center mb-3">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaSquareXTwitter size={20} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon mx-2"
        >
          <FaLinkedinIn size={20} />
        </a>
      </div>
      {/* Copyright Text */}
      <div className="footer-bottom text-center mt-4">
        <p>&copy; 2024 Garware Hi Tech Films Limited. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
