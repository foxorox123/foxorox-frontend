import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [status, setStatus] = useState("processing");
  const [secondsLeft, setSecondsLeft] = useState(30);

  const generateDeviceId = () => {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = Math.random().toString(36).substring(2);
      localStorage.setItem("device_id", id);
    }
    return id;
  };

  useEffect(() => {
    const device_id = generateDeviceId();
    let interval;
    let attempts = 0;

    const tryConfirm = () => {
      const user = auth.currentUser;

      if (!user || user.email !== email) {
        console.warn("⏳ Waiting for user to be available...");
        return;
      }

      fetch("https://foxorox-backend.onrender.com/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, device_id }),
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
          console.error("❌ Error:", err);
          setStatus("error");
        });
    };

    interval = setInterval(() => {
      attempts++;
      setSecondsLeft((s) => s - 1);

      if (attempts >= 30) {
        clearInterval(interval);
        setStatus("error");
        setTimeout(() => navigate("/login"), 4000);
      } else {
        tryConfirm();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, email, plan]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      {status === "processing" ? (
        <>
          <h1>⏳ Processing your transaction...</h1>
          <p>Please wait ({secondsLeft}s)</p>
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
