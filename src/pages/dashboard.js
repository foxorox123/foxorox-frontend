import React, { useEffect } from "react";
import "./Dashboard.css";

function Dashboard({ user, logout }) {
  const subscriptionType = "Global Yearly"; // Możesz też dynamicznie pobierać z backendu

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
      plotLineColorGrowing: "rgba(0, 255, 0, 1)",
      plotLineColorFalling: "rgba(255, 0, 0, 1)",
      gridLineColor: "rgba(42, 46, 57, 0.5)",
      scaleFontColor: "rgba(120, 123, 134, 1)",
      belowLineFillColorGrowing: "rgba(0, 255, 0, 0.05)",
      belowLineFillColorFalling: "rgba(255, 0, 0, 0.05)",
      symbolActiveColor: "rgba(0, 255, 0, 0.15)",
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="left">
          <<h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo-foxorox.png" alt="Foxorox Icon" style={{ height: "30px" }} />
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
