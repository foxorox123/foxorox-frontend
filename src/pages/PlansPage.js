import React from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

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

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="main-container" style={{ position: "relative", minHeight: "100vh", backgroundColor: "#121212", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: "#121212",
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: false },
              resize: true,
            },
          },
          particles: {
            color: { value: "#ffffff" },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: { enable: true, speed: 0.5 },
            number: { density: { enable: true, area: 800 }, value: 30 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: 2 },
          },
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: 20 }}>
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
            You must sign in before subscribing to a plan.
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: 30, gap: 20 }}>
          <div className="plan-card" style={{ width: 250 }}>
            <h2>🟢 Basic Monthly</h2>
            <p>NASDAQ & S&P 500 – candle pattern prediction</p>
            <button onClick={() => handleSubscribe("basic_monthly")}>
              Subscribe to Basic Monthly – $79.99
            </button>
          </div>
          <div className="plan-card" style={{ width: 250 }}>
            <h2>🔵 Basic Yearly</h2>
            <p>NASDAQ & S&P 500 – full year access</p>
            <button onClick={() => handleSubscribe("basic_yearly")}>
              Subscribe to Basic Yearly – $790.00
            </button>
          </div>
          <div className="plan-card" style={{ width: 250 }}>
            <h2>🟠 Global Monthly</h2>
            <p>Global markets + Markov modeling</p>
            <button onClick={() => handleSubscribe("global_monthly")}>
              Subscribe to Global Monthly – $129.99
            </button>
          </div>
          <div className="plan-card" style={{ width: 250 }}>
            <h2>🔴 Global Yearly</h2>
            <p>All features, all markets, full year</p>
            <button onClick={() => handleSubscribe("global_yearly")}>
              Subscribe to Global Yearly – $1290.00
            </button>
          </div>
        </div>

        {/* Screenshots Section */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          marginTop: 60,
          position: "relative",
        }}>
          <div style={{
            border: "2px solid #ffffff22",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            overflow: "hidden",
            position: "relative",
            zIndex: 2,
          }}>
            <img src="/screen1.png" alt="Screenshot 1" style={{ width: "320px", display: "block" }} />
          </div>
          <div style={{
            border: "2px solid #ffffff22",
            borderRadius: "10px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
            overflow: "hidden",
            position: "relative",
            left: "-100px",
            top: "50px",
            zIndex: 1,
          }}>
            <img src="/screen2.png" alt="Screenshot 2" style={{ width: "320px", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlansPage;
