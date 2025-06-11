import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Użyj wspólnego stylu

function DownloadsBasic({ user }) {
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
          // Pobierz wersję Basic
          const response = await fetch(`https://foxorox-backend.onrender.com/download/basic?email=${user.email}`);
          if (response.redirected) {
            window.location.href = response.url;
          }
        } else {
          alert("Download failed or subscription inactive.");
          navigate("/plans");
        }
      } catch (err) {
        console.error("Error in verification of your subscription:", err);
        alert("Błąd serwera. Spróbuj ponownie później.");
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
            Foxorox Basic Download
          </h1>
        </div>
      </header>
      <main className="dashboard-content">
        <p style={{ color: "#ccc", marginTop: "30px" }}>
          Jeżeli pobieranie się nie rozpoczęło, kliknij poniżej:
        </p>
        <a
          href={`https://foxorox-backend.onrender.com/download/basic?email=${user?.email}`}
          className="google-btn"
          download
        >
          ⬇️ Pobierz Foxorox Basic (.exe)
        </a>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "40px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Przejdź do Dashboard
        </button>
      </main>
    </div>
  );
}

export default DownloadsBasic;
