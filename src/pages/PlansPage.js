import React from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

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

  const handleSubscribe = (plan) => {
    if (!user || !user.email) {
      localStorage.setItem("selectedPlan", plan);
      navigate("/login");
    } else {
      subscribe(plan);
    }
  };

  return (
    <div className="main-container aurora-background">
      <StarryBackground />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="/logo-foxorox.png" alt="Foxorox" style={{ height: 100 }} />
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 15, fontWeight: "bold", color: "#fff" }}>
                {user.email}
              </span>
              <button className="google-btn" style={{ marginRight: 10 }} onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </button>
              <button className="google-btn" onClick={logout}>Sign out</button>
            </>
          ) : (
            <button className="google-btn" onClick={() => navigate("/login")}>
              Sign in to Subscribe
            </button>
          )}
        </div>
      </div>

      <h2 style={{ marginTop: 40, textAlign: "center", color: "#fff" }}>Choose Your Plan</h2>

      {!user && (
        <p style={{ textAlign: "center", color: "#ccc", marginBottom: 30 }}>
          Subscribe to a plan and make money with AI tool.
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: 30, gap: 20 }}>
        <div className="plan-card" style={{ width: 250 }}>
          <h2>🟢 Basic Monthly</h2>
          <p>
            NASDAQ100 & S&P 500 – monthly access<br />
            predicts next candle based on AI prediction<br />
            includes all stocks from Nasdaq100 and S&P 500<br />
            shows stock highest probability to move up or down<br />
            iterations up to 300 trading sessions<br />
            interactive charts<br />
            you can resign at any time<br />
            charged monthly<br />
          </p>
          <button onClick={() => handleSubscribe("basic_monthly")}>
            Subscribe to Basic Monthly – $79.99
          </button>
        </div>
        <div className="plan-card" style={{ width: 250 }}>
          <h2>🔵 Basic Yearly</h2>
          <p>
            NASDAQ100 & S&P 500 – yearly access<br />
            predicts next candle based on AI prediction<br />
            includes all stocks from Nasdaq100 and S&P 500<br />
            shows stock highest probability to move up or down<br />
            iterations up to 300 trading sessions<br />
            interactive charts<br />
            you can resign at any time<br />
            charged once per year<br />
          </p>
          <button onClick={() => handleSubscribe("basic_yearly")}>
            Subscribe to Basic Yearly – $790.00
          </button>
        </div>
        <div className="plan-card" style={{ width: 250 }}>
          <h2>🟠 Global Monthly</h2>
          <p>
            Global markets + Markov modeling<br />
            includes Nasdaq100, S&P500, NIKKEI225, CAC40, DAX40, FTS100, WIG20<br />
            includes advanced AI algorithms based on Markov modeling<br />
            predicts next candle based on AI prediction<br />
            includes all stocks from Nasdaq100 and S&P 500<br />
            shows stock highest probability to move up or down<br />
            iterations up to 300 trading sessions<br />
            interactive charts<br />
            you can resign at any time<br />
            charged monthly<br />
          </p>
          <button onClick={() => handleSubscribe("global_monthly")}>
            Subscribe to Global Monthly – $129.99
          </button>
        </div>
        <div className="plan-card" style={{ width: 250 }}>
          <h2>🔴 Global Yearly</h2>
          <p>
            Global markets + Markov modeling<br />
            includes Nasdaq100, S&P500, NIKKEI225, CAC40, DAX40, FTS100, WIG20<br />
            includes advanced AI algorithms based on Markov modeling<br />
            predicts next candle based on AI prediction<br />
            includes all stocks from Nasdaq100 and S&P 500<br />
            shows stock highest probability to move up or down<br />
            iterations up to 300 trading sessions<br />
            interactive charts<br />
            you can resign at any time<br />
            charged yearly<br />
          </p>
          <button onClick={() => handleSubscribe("global_yearly")}>
            Subscribe to Global Yearly – $1290.00
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlansPage;
