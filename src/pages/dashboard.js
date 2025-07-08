import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatPanelFirebase from "./ChatPanelFirebase";
import "./Dashboard.css";

function Dashboard({ user, logout }) {
  const navigate = useNavigate();
  const [subscriptionType, setSubscriptionType] = useState("");

  const bullTips = [
    "📈 AI suggests upward momentum in S&P 500.",
    "🚀 Bullish breakout possible on WIG20.",
    "📊 DAX 40 holding above support zone.",
  ];

  const bearTips = [
    "📉 NASDAQ shows topping pattern.",
    "⚠️ CAC 40 resistance at 7,800 – watch closely.",
    "🔻 Bear divergence on FTSE 100 hourly chart.",
  ];

  const getDeviceId = () => {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id =
        Math.random().toString(36).substring(2) +
        Date.now().toString(36);
      localStorage.setItem("device_id", id);
    }
    return id;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getDeviceId()).then(() => {
      alert("DEVICE ID copied to clipboard!");
    });
  };

  useEffect(() => {
    const tickerScript = document.createElement("script");
    tickerScript.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    tickerScript.async = true;
    tickerScript.innerHTML = JSON.stringify({
      symbols: [
        { proName: "OANDA:SPX500USD", title: "S&P 500 Futures" },
        { proName: "OANDA:NAS100USD", title: "Nasdaq 100 Futures" },
        { proName: "EUREX:FDAX1!", title: "DAX Futures" },
        { proName: "GPW:FW20M2025", title: "WIG20 Futures" },
        { proName: "BET:BSE", title: "BUX Index" },
        { proName: "TVC:NI225", title: "Nikkei 225" },
      ],
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });

    const tickerContainer = document.getElementById("ticker-tape");
    if (tickerContainer) tickerContainer.innerHTML = "";
    tickerContainer.appendChild(tickerScript);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "600",
      isTransparent: false,
      showSymbolLogo: true,
      tabs: [
        {
          title: "America",
          symbols: [
            { s: "NASDAQ:NDX", d: "NASDAQ 100" },
            { s: "OANDA:SPX500USD", d: "S&P 500" },
            { s: "DJ:DJI", d: "Dow Jones" },
          ],
        },
        {
          title: "Europe",
          symbols: [
            { s: "XETR:DAX", d: "DAX 40" },
            { s: "EURONEXT:PX1", d: "CAC 40" },
            { s: "LSE:UKX", d: "FTSE 100" },
          ],
        },
        {
          title: "EMEA",
          symbols: [
            { s: "GPW:WIG20", d: "WIG20" },
            { s: "TADAWUL:TASI", d: "Tadawul All Share" },
            { s: "MOEX:IMOEX", d: "MOEX Russia" },
          ],
        },
        {
          title: "Asia",
          symbols: [
            { s: "TVC:NI225", d: "Nikkei 225" },
            { s: "TVC:HSI", d: "Hang Seng" },
            { s: "SSE:000001", d: "Shanghai Composite" },
          ],
        },
      ],
    });

    const container = document.getElementById("tradingview-widget");
    if (container) container.innerHTML = "";
    container.appendChild(script);
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const deviceId = getDeviceId();
        const res = await fetch(
          "https://foxorox-backend.onrender.com/check-subscription",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email, device_id: deviceId }),
          }
        );

        const data = await res.json();
        if (data.active && data.plan) {
          const planMap = {
            basic_monthly: "Basic Monthly",
            basic_yearly: "Basic Yearly",
            global_monthly: "Global Monthly",
            global_yearly: "Global Yearly",
          };
          setSubscriptionType(planMap[data.plan] || "Active");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Subscription check failed:", err);
        navigate("/");
      }
    };

    if (user && user.emailVerified) {
      checkSubscription();
    }
  }, [user, navigate]);

  return (
    <div className="dashboard-container">
      <div id="ticker-tape" style={{ marginBottom: "20px" }}></div>

      <header className="dashboard-header">
        <div className="left">
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/logo-foxorox.png"
              alt="Foxorox Icon"
              style={{ height: "55px" }}
            />
            Foxorox Dashboard
          </h1>
        </div>
        <div className="right">
          <div style={{ textAlign: "right" }}>
            <strong>{user.email}</strong>
            <div style={{ fontSize: "0.9em", color: "#ccc" }}>
              Subscription: {subscriptionType}
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            Sign out
          </button>
        </div>
      </header>

      <main className="dashboard-content" style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <section className="market-overview">
            <h2>🌍 Market Overview – Global Indexes</h2>
            <div id="tradingview-widget" />
          </section>

          <div className="ai-tips-wrapper">
            <section className="ai-tips">
              <h2>📗 AI Tips for Bulls</h2>
              <ul>
                {bullTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className="ai-tips">
              <h2>📕 AI Tips for Bears</h2>
              <ul>
                {bearTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <ChatPanelFirebase user={user} />
      </main>

      {/* ▶ Download Section at Bottom */}
      {subscriptionType && (
        <div className="download-section">
          <p style={{ textAlign: "center", marginBottom: "15px", fontWeight: "bold", color: "white" }}>
            Please download your version of Foxorox.<br />
            Please copy your DEVICE ID during login to AI program.<br />
            Please be aware that button with download link will apear only once.<br />
            Please copy and remember your DEVICE ID
          </p>

          {subscriptionType.includes("Basic") ? (
            <a
              href={`https://foxorox-backend.onrender.com/download/basic?email=${encodeURIComponent(
                user.email
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
            >
              📥 Download Basic Version
            </a>
          ) : subscriptionType.includes("Global") ? (
            <a
              href={`https://foxorox-backend.onrender.com/download/premium?email=${encodeURIComponent(
                user.email
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn"
            >
              📥 Download Premium Version
            </a>
          ) : null}

          {/* ▶ DEVICE ID & Copy Button */}
          <div
            className="download-btn"
            style={{
              marginTop: "15px",
              textAlign: "center",
              backgroundColor: "#444",
              cursor: "default",
            }}
          >
            DEVICE ID: {getDeviceId()}
          </div>

          <button
            onClick={handleCopy}
            className="download-btn"
            style={{ marginTop: "10px", backgroundColor: "#666" }}
          >
            📋 Copy DEVICE ID
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
