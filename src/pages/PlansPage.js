import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

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

      {/* Logo + Slogan + Auth Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 30,
          padding: "0 30px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src="/logo-foxorox.png"
            alt="Foxorox"
            style={{ height: 190 }}
          />
          <div
            style={{
              fontFamily: "'Segoe UI', sans-serif",
              fontWeight: "bold",
              fontSize: "2em",
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
            <button
              className="google-btn"
              onClick={() => {
                localStorage.setItem("selectedPlan", "basic_monthly");
                navigate("/login");
              }}
            >
              Sign in to Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Reszta bez zmian (plany + screenshoty) */}
      {/* ... (Twój kod plans + screenshoty tutaj pozostaje bez zmian) */}
    </div>
  );
}

export default PlansPage;
