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
    const maxWait = 30;
    let elapsed = 0;

    // Użyj localStorage fallback jeśli email/plan z URL są niedostępne
    const safeEmail = email || localStorage.getItem("postPaymentEmail");
    const safePlan = plan || localStorage.getItem("postPaymentPlan");

    const interval = setInterval(() => {
      elapsed++;
      setSecondsLeft(maxWait - elapsed);
      if (elapsed >= maxWait && !resolved) {
        clearInterval(interval);
        setMessage("⚠️ Could not confirm your login. Please log in again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    }, 1000);

    const device_id = localStorage.getItem("device_id") || generateDeviceId();
    localStorage.setItem("device_id", device_id);

    const checkSubscription = async () => {
      console.log("⏳ Sprawdzanie subskrypcji dla:", safeEmail);

      const user = auth.currentUser;

      if (!user || user.email !== safeEmail) {
        console.warn("⚠️ Nie można potwierdzić tożsamości użytkownika.");
        return;
      }

      try {
        const res = await fetch("https://foxorox-backend.onrender.com/check-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: safeEmail, device_id }),
        });

        const data = await res.json();

        if (data.active) {
          resolved = true;
          clearInterval(interval);
          localStorage.removeItem("postPaymentPlan");
          localStorage.removeItem("postPaymentEmail");

          if (data.plan.startsWith("basic")) {
            navigate("/downloads/basic");
          } else {
            navigate("/downloads/premium");
          }
        } else {
          console.warn("❌ Subskrypcja nieaktywna:", data);
        }
      } catch (err) {
        console.error("❌ Błąd połączenia z backendem:", err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === safeEmail && !resolved) {
        checkSubscription();
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigate, plan, email]);

  const generateDeviceId = () => {
    return "device-" + Math.random().toString(36).substr(2, 10);
  };

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      {message.includes("Processing") && <p>Please wait ({secondsLeft}s)...</p>}
    </div>
  );
};

export default Processing;
