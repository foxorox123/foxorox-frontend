import React from "react";
import "./Dashboard.css"; // Dodaj styl dla dashboardu

function Dashboard({ user, logout }) {
  // Placeholder logów i tipów
  const logs = [
    { time: "2025-06-08 10:21", action: "Subscription activated (Global Yearly)" },
    { time: "2025-06-05 08:10", action: "Logged in from Warsaw, Poland" },
  ];

  const tips = [
    "📈 AI indicates potential bullish reversal in S&P 500.",
    "📉 Watch for resistance at 15,300 on NASDAQ – high volatility expected.",
    "💡 Markov model signals neutral trend on DAX 40 this week.",
  ];

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
          <h2>📉 Market Overview</h2>
          <p>
            Real-time AI-driven analytics will appear here. Add charts,
            tickers or heatmaps later using APIs like TradingView or Finnhub.
          </p>
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
