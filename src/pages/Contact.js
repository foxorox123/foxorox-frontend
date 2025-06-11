import React from "react";

export default function Contact() {
  return (
    <div className="main-container">
      <img src="/logo-foxorox.png" alt="Foxorox Logo" className="logo" />
      <h1 className="highlight">Contact Us</h1>
      <p className="subtitle">
        Got questions? Email us at <a href="mailto:support@foxorox.com" style={{ color: '#f58220' }}>support@foxorox.ai</a><br />
        Support is available Mon–Fri, 9AM–5PM (CET).
      </p>
    </div>
  );
}