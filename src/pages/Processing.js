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

  const [status, setStatus] = useState("processing"); // 'processing' | 'error'
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    let interval;
    let attempts = 0;

    const tryConfirm = () => {
      const user = auth.currentUser;

      if (!user || user.email !== email) {
        console.warn("⏳ Waiting for user to be available...");
        return;
      }

      // 🧠 Wywołanie backendu
      fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, device_id: "web" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.active) {
            // ✅ Sukces
            localStorage.removeItem("postPaymentPlan");
            localStorage.removeItem("postPaymentEmail");

            if (data.plan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          } else {
            console.warn("⏳ Subskrypcja jeszcze nieaktywna...");
          }
        })
        .catch((err) => {
          console.error("❌ Błąd połączenia:", err);
          setStatus("error");
        });
    };

    const intervalId = setInterval(() => {
      attempts++;
      setSecondsLeft((s) => s - 1);

      if (attempts >= 30) {
        clearInterval(intervalId);
        setStatus("error");
        setTimeout(() => navigate("/login"), 4000);
      } else {
        tryConfirm();
      }
    }, 1000);

    return () => clearInterval(intervalId);
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
