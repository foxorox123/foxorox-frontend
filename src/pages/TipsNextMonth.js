import React from "react";
import { useNavigate } from "react-router-dom";

const TipsNextMonth = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, color: "#fff", fontFamily: "Segoe UI" }}>
      <h1 style={{ color: "#f58220" }}>📈 AI Tips for Next Month</h1>
      <p style={{ maxWidth: 800 }}>
        Based on Foxorox AI models, here are the market insights for the upcoming month:
      </p>
     

      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* 🏠 Powrót do planów */}
        <button
          className="google-btn"
          onClick={() => navigate("/")}
          style={{ maxWidth: 250, alignSelf: "center" }}
        >
          ⬅ Back to Plans
        </button>

        {/* 📰 Link do bloga HTML */}
        <a
          href="/blog/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="google-btn"
          style={{
            display: "inline-block",
            textAlign: "center",
            maxWidth: 250,
            alignSelf: "center",
            textDecoration: "none",
          }}
        >
          📰 Visit Foxorox AI Blog
        </a>
      </div>
    </div>
  );
};

export default TipsNextMonth;

