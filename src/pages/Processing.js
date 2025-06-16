import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [secondsLeft, setSecondsLeft] = useState(30);
  const [message, setMessage] = useState("⏳ Processing your transaction...");

  useEffect(() => {
    let resolved = false;
    const device_id = localStorage.getItem("device_id") || generateDeviceId();
    localStorage.setItem("device_id", device_id);

    const checkSubscription = () => {
      console.log("🔍 Checking subscription with:", email, device_id);

      fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, device_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.active && !resolved) {
            resolved = true;
            localStorage.removeItem("postPaymentPlan");
            localStorage.removeItem("postPaymentEmail");
            sessionStorage.removeItem("postPaymentPlan");
            sessionStorage.removeItem("postPaymentEmail");

            if (data.plan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          }
        })
        .catch((err) => {
          console.error("❌ Subscription check failed:", err);
        });
    };

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0 && !resolved) {
          setMessage("⚠️ Could not confirm your subscription. Please log in again.");
          setTimeout(() => navigate("/login"), 3000);
        }
        return next;
      });
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === email) {
        checkSubscription();
      }
    });

    checkSubscription(); // try immediately once

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigate, email, plan]);

  const generateDeviceId = () => {
    return "dev-" + Math.random().toString(36).substring(2, 15);
  };

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      {message.includes("Processing") && (
        <p>Please wait ({secondsLeft}s)...</p>
      )}
    </div>
  );
};

export default Processing;
