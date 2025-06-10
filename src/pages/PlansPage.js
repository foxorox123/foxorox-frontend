import React from "react";
import { useNavigate } from "react-router-dom";

function PlansPage({ user, logout, subscribe }) {
  const navigate = useNavigate();

  return (
    <div className="main-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/logo-foxorox.png" alt="Foxorox" style={{ height: 100 }} />
        <div>
          <span style={{ marginRight: 15, fontWeight: "bold" }}>
            {user?.email}
          </span>
          <button
            style={{ marginRight: 10 }}
            className="google-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
          <button className="google-btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: 40, textAlign: "center" }}>Choose Your Plan</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 30,
          gap: 20,
        }}
      >
        <div className="plan-card" style={{ width: 250 }}>
          <h2>🟢 Basic Monthly</h2>
          <p>NASDAQ & S&P 500 – candle pattern prediction</p>
          <button onClick={() => subscribe("basic_monthly")}>
            Subscribe – $79.99
          </button>
        </div>

        <div className="plan-card" style={{ width: 250 }}>
          <h2>🔵 Basic Yearly</h2>
          <p>NASDAQ & S&P 500 – full year access</p>
          <button onClick={() => subscribe("basic_yearly")}>
            Subscribe – $790.00
          </button>
        </div>

        <div className="plan-card" style={{ width: 250 }}>
          <h2>🟠 Global Monthly</h2>
          <p>Global markets + Markov modeling</p>
          <button onClick={() => subscribe("global_monthly")}>
            Subscribe – $129.99
          </button>
        </div>

        <div className="plan-card" style={{ width: 250 }}>
          <h2>🔴 Global Yearly</h2>
          <p>All features, all markets, full year</p>
          <button onClick={() => subscribe("global_yearly")}>
            Subscribe – $1290.00
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlansPage;
