// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <nav>
        <Link to="/about">About</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  );
}

export default Footer;
