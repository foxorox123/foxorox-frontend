import React from "react";
import { useNavigate } from "react-router-dom";

const ExploreFeatures = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40, color: "#fff", fontFamily: "Segoe UI" }}>
      <h1 style={{ color: "#f58220" }}>🌟 Explore Foxorox Features</h1>
      <p style={{ maxWidth: 800 }}>
        Foxorox offers powerful tools for AI-powered market analysis. Here are the key features:
      </p>
      <ul style={{ marginTop: 20, lineHeight: "1.8" }}>
        <li>✅ Predictive modeling for global markets</li>
        <li>✅ AI-powered candle forecasts</li>
        <li>✅ Interactive historical charts</li>
        <li>✅ Heatmaps for top gainers/losers</li>
        <li>✅ User-friendly interface for traders</li>
        <li>✅ Monthly & yearly plans with flexibility</li>
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

export default ExploreFeatures;
