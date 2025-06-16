import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [secondsLeft, setSecondsLeft] = useState(90);
  const [message, setMessage] = useState("⏳ Processing your transaction...");

  useEffect(() => {
    let retries = 0;
    const maxRetries = 30;
    const retryInterval = 3000;

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => prev - 3);
    }, retryInterval);

    const checkSubscription = () => {
      const user = auth.currentUser;
      if (!user || user.email !== email) return;

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
            sessionStorage.removeItem("postPaymentPlan");
            sessionStorage.removeItem("postPaymentEmail");

            if (data.plan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          } else {
            retries++;
            if (retries >= maxRetries) {
              setMessage("❌ Subscription inactive. Please log in again.");
              setTimeout(() => navigate("/login"), 5000);
            }
          }
        })
        .catch((err) => {
          console.error("❌ Subscription check error:", err);
          setMessage("❌ Error verifying subscription.");
          setTimeout(() => navigate("/login"), 5000);
        });
    };

    const attemptInterval = setInterval(() => {
      checkSubscription();
    }, retryInterval);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === email) {
        checkSubscription();
      }
    });

    return () => {
      unsubscribe();
      clearInterval(attemptInterval);
      clearInterval(countdown);
    };
  }, [navigate, email, plan]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      {message.startsWith("⏳") && (
        <p>Estimated wait: {secondsLeft}s</p>
      )}
    </div>
  );
};

export default Processing;
