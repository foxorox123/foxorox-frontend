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

  const [status, setStatus] = useState("processing");
  const [secondsLeft, setSecondsLeft] = useState(90);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 30;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== email) {
        console.warn("Waiting for auth state...");
        return;
      }

      const interval = setInterval(() => {
        attempts++;
        setSecondsLeft((s) => s - 3);

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
              clearInterval(interval);

              if (data.plan.startsWith("basic")) {
                navigate("/downloads/basic");
              } else {
                navigate("/downloads/premium");
              }
            }
          })
          .catch((err) => {
            console.error("Backend error:", err);
            clearInterval(interval);
            setStatus("error");
            setTimeout(() => navigate("/login"), 5000);
          });

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setStatus("error");
          setTimeout(() => navigate("/login"), 5000);
        }
      }, 3000);
    });

    return () => unsubscribe();
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
