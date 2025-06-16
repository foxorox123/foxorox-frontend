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
    const maxWait = 30; // seconds
    let elapsed = 0;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === email && !resolved) {
        resolved = true;
        localStorage.removeItem("postPaymentPlan");
        localStorage.removeItem("postPaymentEmail");

        if (plan && plan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else {
          navigate("/downloads/premium");
        }
      }
    });

    const interval = setInterval(() => {
      elapsed++;
      setSecondsLeft(maxWait - elapsed);
      if (elapsed >= maxWait && !resolved) {
        clearInterval(interval);
        unsubscribe();
        setMessage("⚠️ Could not confirm your login. Please log in again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigate, plan, email]);

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
