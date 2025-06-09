import React, { useEffect } from "react";
import "./Dashboard.css";

function Dashboard({ user, logout }) {
  const logs = [
    { time: "2025-06-08 10:21", action: "Subscription activated (Global Yearly)" },
    { time: "2025-06-05 08:10", action: "Logged in from Warsaw, Poland" },
  ];

  const tips = [
    "📈 AI indicates potential bullish reversal in S&P 500.",
    "📉 Watch for resistance at 15,300 on NASDAQ – high volatility expected.",
    "💡 Markov model signals neutral trend on DAX 40 this week.",
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
      largeChartUrl: "",
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
          originalTitle: "America",
        },
        {
          title: "Europe",
          symbols: [
            { s: "XETR:DAX", d: "DAX 40" },
            { s: "EURONEXT:PX1", d: "CAC 40" },
            { s: "LSE:UKX", d: "FTSE 100" },
          ],
          originalTitle: "Europe",
        },
        {
          title: "EMEA",
          symbols: [
            { s: "GPW:WIG20", d: "WIG20" },
            { s: "TADAWUL:TASI", d: "Tadawul All Share" },
            { s: "MOEX:IMOEX", d: "MOEX Russia" },
          ],
          originalTitle: "EMEA",
        },
        {
          title: "Asia",
          symbols: [
            { s: "TSE:N225", d: "Nikkei 225" },
            { s: "HKEX:HSI", d: "Hang Seng" },
            { s: "SSE:000001", d: "Shanghai Composite" },
          ],
          originalTitle: "Asia",
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
          <h1>📊 Foxorox Dashboard</h1>
        </div>
        <div className="right">
          <span>{user.email}</span>
          <button onClick={logout} className="logout-btn">Sign out</button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="market-overview">
          <h2>🌍 Market Overview – Global Indexes</h2>
          <div id="tradingview-widget" />
        </section>

        <section className="activity-logs">
          <h2>🧾 Activity Logs</h2>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>
                <strong>{log.time}</strong>: {log.action}
              </li>
            ))}
          </ul>
        </section>

        <section className="ai-tips">
          <h2>💡 AI Tips</h2>
          <ul>
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
