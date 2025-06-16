import React, { useEffect, useState } from "react";
useEffect(() => {
  let interval;
  let attempts = 0;
  const maxAttempts = 30; // 30 * 3s = 90s

  const tryConfirm = () => {
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
