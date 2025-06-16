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

  const [message, setMessage] = useState("⏳ Processing your transaction...");

  useEffect(() => {
    let retries = 0;
    const maxRetries = 20;

    const interval = setInterval(() => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.email === email) {
          clearInterval(interval);
          if (plan.startsWith("basic")) {
            navigate("/downloads/basic");
          } else {
            navigate("/downloads/premium");
          }
        } else {
          retries++;
          if (retries >= maxRetries) {
            clearInterval(interval);
            setMessage("⚠️ Unable to confirm your login. Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
          }
        }
      });
    }, 1000); // check every 1s

    return () => clearInterval(interval);
  }, [navigate, email, plan]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      <p>Please wait while we verify your subscription and prepare your download.</p>
    </div>
  );
};

export default Processing;
