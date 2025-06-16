import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [secondsLeft, setSecondsLeft] = useState(30);
  const [message, setMessage] = useState("⏳ Verifying your subscription...");

  useEffect(() => {
    if (!email || !plan) {
      setMessage("❌ Missing plan or email. Redirecting...");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    const device_id = localStorage.getItem("device_id") || generateDeviceId();
    localStorage.setItem("device_id", device_id);

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMessage("❌ Could not verify subscription. Try logging in again.");
          setTimeout(() => navigate("/login"), 4000);
        }
        return prev - 1;
      });
    }, 1000);

    // Główna logika sprawdzania subskrypcji
    fetch("https://foxorox-backend.onrender.com/check-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, device_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.active) {
          clearInterval(timer);
          setMessage("✅ Subscription confirmed! Preparing download...");
          setTimeout(() => {
            if (data.plan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("❌ Error checking subscription:", err);
        clearInterval(timer);
        setMessage("❌ Server error. Try again later.");
        setTimeout(() => navigate("/login"), 4000);
      });

    return () => clearInterval(timer);
  }, [email, plan, navigate]);

  const generateDeviceId = () =>
    "dev-" + Math.random().toString(36).substring(2, 10);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      {message.includes("Verifying") && (
        <p>Please wait... {secondsLeft}s</p>
      )}
    </div>
  );
};

export default Processing;
