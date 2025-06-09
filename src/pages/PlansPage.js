import React from "react";

function PlansPage({ user, logout, subscribe }) {
  return (
    <div className="main-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="/logo-foxorox.png" alt="Foxorox" style={{ height: 50 }} />
        <div>
          <span style={{ marginRight: 15, fontWeight: "bold" }}>{user?.email}</span>
          <button className="google-btn" onClick={logout}>Sign out</button>
        </div>
      </div>

      <h2 style={{ marginTop: 40 }}>Choose Your Plan</h2>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30 }}>
        <div className="plan-card" style={{ marginBottom: 20 }}>
          <h2>🟢 Basic Monthly</h2>
          <p>NASDAQ & S&P 500 – candle pattern prediction</p>
          <button onClick={() => subscribe("basic_monthly")}>Subscribe – $79.99</button>
        </div>

        <div className="plan-card" style={{ marginBottom: 20 }}>
          <h2>🔵 Basic Yearly</h2>
          <p>NASDAQ & S&P 500 – full year access</p>
          <button onClick={() => subscribe("basic_yearly")}>Subscribe – $790.00</button>
        </div>

        <div className="plan-card" style={{ marginBottom: 20 }}>
          <h2>🟠 Global Monthly</h2>
          <p>Global markets + Markov modeling</p>
          <button onClick={() => subscribe("global_monthly")}>Subscribe – $129.99</button>
        </div>

        <div className="plan-card">
          <h2>🔴 Global Yearly</h2>
          <p>All features, all markets, full year</p>
          <button onClick={() => subscribe("global_yearly")}>Subscribe – $1290.00</button>
        </div>
      </div>
    </div>
  );
}

export default PlansPage;
