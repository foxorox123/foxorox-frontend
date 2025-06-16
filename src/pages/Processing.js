import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";

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

    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 3);

      const user = auth.currentUser;
      if (!user || user.email !== email) {
        retries++;
        console.log("⏳ Waiting for user login sync...", retries);
        if (retries >= maxRetries) {
          clearInterval(interval);
          setMessage("❌ Nie można potwierdzić logowania");
          setTimeout(() => navigate("/login"), 4000);
        }
        return;
      }

      // ✅ Użytkownik jest widoczny — sprawdzamy subskrypcję
      fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, device_id: "web" }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.active) {
            clearInterval(interval);
            localStorage.removeItem("postPaymentPlan");
            localStorage.removeItem("postPaymentEmail");
            if (data.plan.startsWith("basic")) {
              navigate("/downloads/basic");
            } else {
              navigate("/downloads/premium");
            }
          } else {
            retries++;
            console.log("❌ Subskrypcja nieaktywna jeszcze...", retries);
            if (retries >= maxRetries) {
              clearInterval(interval);
              setMessage("⚠️ Subskrypcja nieaktywna. Zaloguj się ponownie.");
              setTimeout(() => navigate("/login"), 4000);
            }
          }
        })
        .catch((err) => {
          console.error("Błąd sprawdzania subskrypcji:", err);
          clearInterval(interval);
          setMessage("❌ Błąd połączenia.");
          setTimeout(() => navigate("/login"), 5000);
        });
    }, 3000);

    return () => clearInterval(interval);
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
