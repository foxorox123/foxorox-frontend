import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard({ user, logout }) {
  const navigate = useNavigate();
  const [subscriptionType, setSubscriptionType] = React.useState("");

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

  // ▶ Ticker Tape
  useEffect(() => {
    const tickerScript = document.createElement("script");
    tickerScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    tickerScript.async = true;
    tickerScript.innerHTML = JSON.stringify({
      symbols: [
        { proName: "CME_MINI:ES1!", title: "S&P 500 Futures" },
        { proName: "CME_MINI:NQ1!", title: "Nasdaq Futures" },
        { proName: "EUREX:FDAX1!", title: "DAX Futures" },
        { proName: "GPW:FW20M2025", title: "WIG20 Futures" },
        { proName: "BET:BSE", title: "BUX Index (proxy)" },
        { proName: "OSE:NK1!", title: "Nikkei Futures" },
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

  // ▶ TradingView Market Overview
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
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
            { s: "TSE:N225", d: "Nikkei 225" },
            { s: "HKEX:HSI", d: "Hang Seng" },
            { s: "SSE:000001", d: "Shanghai Composite" },
          ],
        },
      ],
    });

    const container = document.getElementById("tradingview-widget");
    if (container) container.innerHTML = "";
    container.appendChild(script);
  }, []);

  // ▶ Check subscription and navigate to /dashboard
  // ▶ Check subscription and set plan type
 useEffect(() => {
  const checkSubscription = async () => {
    try {
      const res = await fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

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
        setSubscriptionType("Inactive");
      }
    } catch (err) {
      console.error("Subscription check failed:", err);
      setSubscriptionType("Error");
    }
  };

  if (user && user.emailVerified) {
    checkSubscription();
  }
}, [user]);


    if (user && user.emailVerified) {
      checkSubscriptionAndRedirect();
    }
  }, [user, navigate]);

  return (
    <div className="dashboard-container">
      {/* ▶ Ticker Tape Widget */}
      <div id="ticker-tape" style={{ marginBottom: "20px" }}></div>

      {/* ▶ Header */}
      <header className="dashboard-header">
        <div className="left">
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo-foxorox.png" alt="Foxorox Icon" style={{ height: "55px" }} />
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
          <button onClick={logout} className="logout-btn">Sign out</button>
        </div>
      </header>

      {/* ▶ Main */}
      <main className="dashboard-content">
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
      </main>
    </div>
  );
}

export default Dashboard;
