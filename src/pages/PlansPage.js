import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import Footer from "../components/Footer";
import TradingViewTicker from "../components/TradingViewTicker";

/** =========================
 *  Box z walutami (TradingView) — dopasowanie wysokości do planów
 *  ========================= */
function CurrencyBox({ heightPx = 410, widthPx = 300 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !heightPx) return;

    // Wyczyść poprzednią instancję
    containerRef.current.innerHTML = "";

    // Placeholder wymagany przez TradingView
    const widgetHost = document.createElement("div");
    widgetHost.className = "tradingview-widget-container__widget";
    containerRef.current.appendChild(widgetHost);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;

    // Szerokość z kontenera (100%), wysokość = wysokość planów
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: String(heightPx),
      isTransparent: false,
      showSymbolLogo: true,
      tabs: [
        {
          title: "Forex",
          symbols: [
            { s: "FX:EURUSD", d: "EUR/USD" },
            { s: "FX:GBPUSD", d: "GBP/USD" },
            { s: "FX:USDJPY", d: "USD/JPY" },
            { s: "FX:AUDUSD", d: "AUD/USD" },
            { s: "FX:USDCAD", d: "USD/CAD" }
          ]
        }
      ]
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [heightPx]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{
        width: widthPx,
        background: "#1e1e1e",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        minHeight: heightPx // unika skakania layoutu zanim załaduje się widget
      }}
    />
  );
}

function StarryBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -2 },
        particles: {
          number: { value: 150 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.8 },
          size: { value: 1 },
          move: { enable: true, speed: 0.2 }
        },
        background: { color: "transparent" }
      }}
    />
  );
}

function PlansPage({ user, logout, subscribe }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // >>> pomiar wysokości sekcji planów
  const plansRowRef = useRef(null);
  const [plansHeight, setPlansHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!plansRowRef.current) return;
      const h = Math.round(plansRowRef.current.getBoundingClientRect().height);
      if (h && h !== plansHeight) setPlansHeight(h);
    };

    // pierwszy pomiar po renderze
    const t = setTimeout(measure, 0);

    // reaguj na resize
    window.addEventListener("resize", measure);

    // obserwuj zmiany rozmiaru kontenera (bardziej niezawodne)
    let ro;
    if (typeof ResizeObserver !== "undefined" && plansRowRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(plansRowRef.current);
    }

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
    };
  }, [plansHeight]);

  const handleSubscribe = async (plan) => {
    if (!user || !user.email) {
      localStorage.setItem("selectedPlan", plan);
      navigate("/login");
    } else {
      setLoading(true);
      try {
        await subscribe(plan);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="main-container aurora-background">
      <StarryBackground />

      {/* Pasek indeksów TradingView */}
      <TradingViewTicker />

      {/* Górny pasek */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 30px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src="/logo-foxorox.png" alt="Foxorox" style={{ height: 200 }} />
          <div
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: "bold",
              fontSize: "2.3em",
              color: "#f58220",
              letterSpacing: "0.5px"
            }}
          >
            AI Powered Market Intelligence
          </div>
        </div>

        <div>
          {user ? (
            <>
              <span
                style={{
                  marginRight: 15,
                  fontWeight: "bold",
                  color: "#fff"
                }}
              >
                {user.email}
              </span>
              <button
                className="google-btn"
                style={{ marginRight: 10 }}
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
              <button className="google-btn" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                className="google-btn"
                onClick={() => {
                  localStorage.setItem("selectedPlan", "basic_monthly");
                  navigate("/login");
                }}
              >
                Sign in to Subscribe/ Log in
              </button>

              {/* ✅ Dodatkowe przyciski */}
              <div style={{ marginTop: 10 }}>
                <button
                  className="google-btn blue-btn"
                  style={{ marginRight: 10 }}
                  onClick={() => navigate("/features")}
                >
                  Explore Features
                </button>
                <button
                  className="google-btn blue-btn"
                  onClick={() => navigate("/tips-next-month")}
                >
                  Tips for Next Month
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <h2 style={{ marginTop: 40, textAlign: "center", color: "#fff" }}>
        Choose Your Plan
      </h2>

      {!user && (
        <p style={{ textAlign: "center", color: "#ccc", marginBottom: 30 }}>
          Subscribe to a plan and make money with AI tool.
        </p>
      )}

      {loading && (
        <div style={{ color: "white", fontWeight: "bold", marginTop: "20px" }}>
          Redirecting to payment... Please wait.
        </div>
      )}

      {/* ====== DWIE KOLUMNY: LEWO (PLANY - 1 linia) | PRAWO (BOX WALUT) ====== */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",        // klucz: wyrównanie wysokości obu kolumn
          justifyContent: "center",
          gap: 24,
          padding: "0 30px",
          marginTop: 30
        }}
      >
        {/* LEWA kolumna: plans row - bez zawijania + scroll poziomy na małych szerokościach */}
        <div
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            overflowX: "auto",
            paddingBottom: 8
          }}
        >
          <div
            ref={plansRowRef}
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 20,
              justifyContent: "flex-start"
            }}
          >
            <div className="plan-card" style={{ width: 250, textAlign: "left" }}>
              <h2>🟢 Basic Monthly</h2>
              <ul>
                <li>NASDAQ100 & S&P 500 – monthly access</li>
                <li>Predicts next candle based on AI prediction</li>
                <li>Includes all stocks from Nasdaq100 and S&P 500</li>
                <li>Shows stock highest probability to move up or down</li>
                <li>Iterations up to 300 trading sessions</li>
                <li>Interactive charts</li>
                <li>You can resign at any time</li>
                <li>Charged monthly</li>
              </ul>
              <button onClick={() => handleSubscribe("basic_monthly")}>
                Subscribe to Basic Monthly – $79.99
              </button>
            </div>

            <div className="plan-card" style={{ width: 250, textAlign: "left" }}>
              <h2>🔵 Basic Yearly</h2>
              <ul>
                <li>NASDAQ100 & S&P 500 – yearly access</li>
                <li>Predicts next candle based on AI prediction</li>
                <li>Includes all stocks from Nasdaq100 and S&P 500</li>
                <li>Shows stock highest probability to move up or down</li>
                <li>Iterations up to 300 trading sessions</li>
                <li>Interactive charts</li>
                <li>You can resign at any time</li>
                <li>Charged once per year</li>
              </ul>
              <button onClick={() => handleSubscribe("basic_yearly")}>
                Subscribe to Basic Yearly – $790.00
              </button>
            </div>

            <div className="plan-card" style={{ width: 250, textAlign: "left" }}>
              <h2>🟠 Global Monthly</h2>
              <ul>
                <li>Global markets + Markov modeling</li>
                <li>
                  Includes Nasdaq100, S&P500, NIKKEI225, CAC40, DAX40, FTS100, WIG20
                </li>
                <li>Includes advanced AI algorithms based on Markov modeling</li>
                <li>Predicts next candle based on AI prediction</li>
                <li>Includes all stocks from Nasdaq100 and S&P 500</li>
                <li>Shows stock highest probability to move up or down</li>
                <li>Iterations up to 300 trading sessions</li>
                <li>Interactive charts</li>
                <li>You can resign at any time</li>
                <li>Charged monthly</li>
              </ul>
              <button onClick={() => handleSubscribe("global_monthly")}>
                Subscribe to Global Monthly – $129.99
              </button>
            </div>

            <div className="plan-card" style={{ width: 250, textAlign: "left" }}>
              <h2>🔴 Global Yearly</h2>
              <ul>
                <li>Global markets + Markov modeling</li>
                <li>
                  Includes Nasdaq100, S&P500, NIKKEI225, CAC40, DAX40, FTS100, WIG20
                </li>
                <li>Includes advanced AI algorithms based on Markov modeling</li>
                <li>Predicts next candle based on AI prediction</li>
                <li>Includes all stocks from Nasdaq100 and S&P 500</li>
                <li>Shows stock highest probability to move up or down</li>
                <li>Iterations up to 300 trading sessions</li>
                <li>Interactive charts</li>
                <li>You can resign at any time</li>
                <li>Charged yearly</li>
              </ul>
              <button onClick={() => handleSubscribe("global_yearly")}>
                Subscribe to Global Yearly – $1290.00
              </button>
            </div>

            {/* NOWY PLAN: Foxorox Forex Monthly */}
            <div className="plan-card" style={{ width: 250, textAlign: "left" }}>
              <h2>💹 Foxorox Forex Monthly</h2>
              <ul>
                <li>Major & popular FX pairs</li>
                <li>Live rates + embedded charts</li>
                <li>AI next-candle prediction</li>
                <li>Gap probability insights</li>
                <li>Interactive charts</li>
                <li>Cancel anytime</li>
                <li>Charged monthly</li>
              </ul>
              <button onClick={() => handleSubscribe("forex_monthly")}>
                Subscribe to Foxorox Forex Monthly – $8.99
              </button>
            </div>
          </div>
        </div>

        {/* PRAWA kolumna: box walut o wysokości identycznej jak plany */}
        <div style={{ flex: "0 0 300px", display: "flex" }}>
          <CurrencyBox heightPx={plansHeight || 420} widthPx={300} />
        </div>
      </div>

      {/* Screenshots Section */}
      <div style={{ marginTop: 49, textAlign: "center" }}>
        <h2 style={{ color: "#fff", marginBottom: 20 }}>Foxorox AI Screenshots</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30
          }}
        >
          <img
            src="/screen1.png"
            alt="Screenshot 1"
            style={{ maxWidth: "50%", borderRadius: 10 }}
          />
          <img
            src="/screen2.png"
            alt="Screenshot 2"
            style={{ maxWidth: "40%", borderRadius: 10 }}
          />
          <img
            src="/screen3.png"
            alt="Screenshot 3"
            style={{ maxWidth: "30%", borderRadius: 10 }}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PlansPage;
