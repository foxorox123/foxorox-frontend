import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function DownloadsPremium({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndDownload = async () => {
      try {
        const res = await fetch("https://foxorox-backend.onrender.com/check-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await res.json();

        if (data.active) {
          const response = await fetch(`https://foxorox-backend.onrender.com/download/premium?email=${user.email}`);
          if (response.redirected) {
            window.location.href = response.url;
          }
        } else {
          alert("Download failed or subscription inactive.");
          navigate("/plans");
        }
      } catch (err) {
        console.error("Error in verification of your subscription:", err);
        alert("Błąd serwera. Spróbuj ponownie.");
      }
    };

    if (user?.emailVerified) verifyAndDownload();
  }, [user, navigate]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="left">
          <h1 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo-foxorox.png" alt="Foxorox Logo" style={{ height: "50px" }} />
            Foxorox Premium Download
          </h1>
        </div>
      </header>

      <main className="dashboard-content">
        <p style={{ color: "#ccc", marginTop: "30px" }}>
          Jeżeli pobieranie się nie rozpoczęło, kliknij poniżej:
        </p>

        <a
          href={`https://foxorox-backend.onrender.com/download/premium?email=${user?.email}`}
          className="google-btn"
          download
          style={{ marginBottom: "20px", display: "inline-block" }}
        >
          ⬇️ Pobierz Foxorox Premium (.exe)
        </a>

        <br />

        <button
          className="google-btn"
          style={{ marginTop: "20px" }}
          onClick={() => navigate("/dashboard")}
        >
          🔙 Go to Dashboard
        </button>
      </main>
    </div>
  );
}

export default DownloadsPremium;
