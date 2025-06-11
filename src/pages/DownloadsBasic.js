import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DownloadsPremium({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const response = await fetch("https://foxorox-backend.onrender.com/download?email=" + encodeURIComponent(user.email));
        if (response.status === 200) {
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
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#f58220",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
        onClick={() => navigate("/dashboard")}
      >
        Go to Dashboard
      </button>
    </div>
  );
}

export default DownloadsPremium;
