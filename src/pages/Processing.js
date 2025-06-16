import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [status, setStatus] = useState("processing"); // 'processing' | 'error'
  const [secondsLeft, setSecondsLeft] = useState(90);

  useEffect(() => {
    let interval;
    let attempts = 0;
    const maxAttempts = 30; // 30 * 3s = 90s

    const tryConfirm = () => {
      const user = auth.currentUser;
      if (!user || user.email !== email) {
        console.warn("Waiting for correct user...");
        return;
      }

      fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, device_id: "web" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.active) {
            localStorage.removeItem("postPaymentPlan");
            localStorage.removeItem("postPaymentEmail");

            if (data.plan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          }
        })
        .catch((err) => {
          console.error("❌ Błąd połączenia:", err);
          setStatus("error");
        });
    };

    interval = setInterval(() => {
      attempts++;
      setSecondsLeft((s) => s - 3);

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus("error");
        setTimeout(() => navigate("/login"), 5000);
      } else {
        tryConfirm();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      {status === "processing" ? (
        <>
          <h1>⏳ Processing your transaction...</h1>
          <p>Please wait while we verify your subscription.</p>
          <p>Time remaining: {secondsLeft}s</p>
        </>
      ) : (
        <>
          <h1>⚠️ Could not confirm your subscription</h1>
          <p>Redirecting to login...</p>
        </>
      )}
    </div>
  );
};

export default Processing;
