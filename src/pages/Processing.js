import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const planFromQuery = params.get("plan");
  const emailFromQuery = params.get("email");

  const [secondsLeft, setSecondsLeft] = useState(30);
  const [message, setMessage] = useState("⏳ Processing your transaction...");

  useEffect(() => {
    let interval;
    let resolved = false;
    let authUnsub;

    const device_id = navigator.userAgent || "unknown";

    const checkSub = (email) => {
      fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, device_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.active) {
            resolved = true;
            setMessage("✅ Subscription confirmed. Redirecting...");
            localStorage.removeItem("postPaymentPlan");
            localStorage.removeItem("postPaymentEmail");
            sessionStorage.removeItem("postPaymentPlan");
            sessionStorage.removeItem("postPaymentEmail");

            setTimeout(() => {
              if (data.plan.startsWith("basic")) {
                navigate("/downloads/basic");
              } else {
                navigate("/downloads/premium");
              }
            }, 1000);
          } else {
            setMessage("⚠️ Subscription not active. Please log in again.");
            setTimeout(() => navigate("/login"), 4000);
          }
        })
        .catch((err) => {
          console.error("❌ Error checking subscription:", err);
          setMessage("❌ Server error. Please try again.");
          setTimeout(() => navigate("/login"), 4000);
        });
    };

    authUnsub = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified && !resolved) {
        checkSub(user.email);
      }
    });

    let elapsed = 0;
    interval = setInterval(() => {
      elapsed++;
      setSecondsLeft(30 - elapsed);
      if (elapsed >= 30 && !resolved) {
        clearInterval(interval);
        authUnsub();
        setMessage("⚠️ Could not confirm your login. Please log in again.");
        setTimeout(() => navigate("/login"), 4000);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (authUnsub) authUnsub();
    };
  }, [navigate]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      {message.includes("Processing") && <p>Please wait ({secondsLeft}s)...</p>}
    </div>
  );
};

export default Processing;
