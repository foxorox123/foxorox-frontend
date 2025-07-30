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
      <ul style={{ marginTop: 20, lineHeight: "1.8" }}>
        <li>🔹 NASDAQ tech sector expected to see continued volatility</li>
        <li>🔹 High probability uptrend in S&P 500 energy stocks</li>
        <li>🔹 European indices may show mixed signals – wait for confirmation</li>
        <li>🔹 Watch for breakout signals in AI-related equities</li>
      </ul>

      <button
        className="google-btn"
        style={{ marginTop: 40 }}
        onClick={() => navigate("/")}
      >
        ⬅ Back to Plans
      </button>
    </div>
  );
};

export default TipsNextMonth;
