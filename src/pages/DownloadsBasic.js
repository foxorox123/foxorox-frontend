import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DownloadsPremium({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const response = await fetch("https://foxorox-backend.onrender.com/download?email=" + encodeURIComponent(user.email));
        if (response.status === 200) {
          // pobieranie pliku
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "FoxoroxApp.exe";
          a.click();
        } else {
          alert("No active subscription or download failed.");
        }
      } catch (error) {
        console.error("Error downloading:", error);
        alert("Download error.");
      }
    };

    if (user?.email) {
      downloadFile();
    }
  }, [user]);

  return (
    <div className="main-container">
      <h1>Your download is starting...</h1>
      <p>If nothing happens, check your subscription or contact support.</p>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default DownloadsPremium;
