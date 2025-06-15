import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function DownloadsBasic({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAndDownload = async () => {
      try {
        const deviceId =
          localStorage.getItem("deviceId") || crypto.randomUUID();
        localStorage.setItem("deviceId", deviceId);

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
          const downloadUrl = `https://foxorox-backend.onrender.com/download/basic?email=${encodeURIComponent(user.email)}`;
          const response = await fetch(downloadUrl);

          if (response.ok && response.headers.get("content-disposition")) {
            // start download
            window.location.href = downloadUrl;
          } else {
            alert("Download failed. Try again.");
          }
        } else {
          alert("Download failed or subscription inactive.");
          navigate("/plans");
        }
      } catch (err) {
        console.error("Error verifying subscription:", err);
        alert("Błąd serwera. Spróbuj ponownie później.");
      }
    };

    if (user?.emailVerified) {
      verifyAndDownload();
    }
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
          href={`https://foxorox-backend.onrender.com/download/basic?email=${encodeURIComponent(user?.email)}`}
          className="google-btn"
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
            cursor: "pointer",
          }}
        >
          Przejdź do Dashboard
        </button>
      </main>
    </div>
  );
}

export default DownloadsBasic;
