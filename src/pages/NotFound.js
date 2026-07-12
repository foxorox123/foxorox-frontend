import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <h1 style={{ color: "#f58220", fontSize: "48px", marginBottom: "10px" }}>404</h1>
      <p style={{ color: "#ccc", fontSize: "18px", marginBottom: "30px" }}>
        This page doesn't exist.
      </p>
      <Link
        to="/"
        style={{
          color: "#f58220",
          textDecoration: "none",
          border: "1px solid #f58220",
          borderRadius: "8px",
          padding: "10px 20px",
        }}
      >
        ← Back to Foxorox
      </Link>
    </div>
  );
}