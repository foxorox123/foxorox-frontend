// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";
import exanteLogo from "./exante.png"; // upewnij się, że plik istnieje w tym katalogu

function Footer() {
  return (
    <footer
      className="footer"
      style={{
        padding: "20px",
        backgroundColor: "#111",
        color: "#f0f0f0",
        fontSize: "16px",
        textAlign: "center",
      }}
    >
      <nav
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <Link to="/about" style={{ color: "#f0f0f0", textDecoration: "none" }}>About</Link>
        <Link to="/faq" style={{ color: "#f0f0f0", textDecoration: "none" }}>FAQ</Link>
        <Link to="/privacy" style={{ color: "#f0f0f0", textDecoration: "none" }}>Privacy</Link>
        <Link to="/terms" style={{ color: "#f0f0f0", textDecoration: "none" }}>Terms</Link>
        <Link to="/contact" style={{ color: "#f0f0f0", textDecoration: "none" }}>Contact</Link>
        <a
          href="/blog/"
          style={{ color: "#f58220", textDecoration: "none", fontWeight: "bold" }}
        >
          Blog
        </a>
      </nav>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <img
          src={exanteLogo}
          alt="Exante Logo"
          style={{ width: "134px", height: "37px" }}
        />
        <a
          href="https://exante.eu/p/39551/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#f58220", textDecoration: "none", fontWeight: "bold" }}
        >
          Partnership with Exante Broker
        </a>
      </div>
    </footer>
  );
}

export default Footer;
