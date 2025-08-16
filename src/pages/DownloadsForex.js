import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function DownloadsForex({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndDownload = async () => {
      try {
        // ujednolicenie device_id (zgodne z backendem)
        const deviceId =
          localStorage.getItem("device_id") ||
          localStorage.getItem("deviceId") ||
          (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

        localStorage.setItem("device_id", deviceId);
        localStorage.setItem("deviceId", deviceId); // backward-compat

        const res = await fetch("https://foxorox-backend.onrender.com/check-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            device_id: deviceId,
          }),
        });

        const data = await res.json();
        if (data.active) {
          const url = `https://foxorox-backend.onrender.com/download/forex?email=${encodeURIComponent(
            user.email
          )}`;
          // start pobierania
          window.location.href = url;
        } else {
          alert("Subscription inactive. Please subscribe to Forex plan.");
          navigate("/"); // lub /plans
        }
      } catch (err) {
        console.error("Error verifying subscription:", err);
        alert("Server error. Try again later.");
      }
    };

    if (user?.emailVerified) {
      verifyAndDownload();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="left">
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo-foxorox.png" alt="Foxorox Logo" style={{ height: "50px" }} />
            Foxorox Forex Download
          </h1>
        </div>
      </header>

      <main className="dashboard-content">
        <p style={{ color: "#ccc", marginTop: "30px" }}>
          If the download didn’t start automatically, click below:
        </p>

        <a
          href={`https://foxorox-backend.onrender.com/download/forex?email=${encodeURIComponent(
            user?.email || ""
          )}`}
          className="google-btn"
        >
          ⬇️ Download Foxorox Forex (.exe)
        </a>
      </main>
    </div>
  );
}
