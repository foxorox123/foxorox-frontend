import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    const maxRetries = 15;

    const interval = setInterval(() => {
      const user = auth.currentUser;

      if (user && user.email === email) {
        clearInterval(interval);

        // ✅ Użytkownik się zgadza — przekieruj do odpowiednich plików
        if (plan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else {
          navigate("/downloads/premium");
        }
      } else {
        retries++;
        if (retries >= maxRetries) {
          clearInterval(interval);
          setMessage("⚠️ Could not confirm your login. Please log in again.");
          setTimeout(() => navigate("/login"), 3000);
        }
      }
    }, 1000); // Co 1s sprawdza czy user już załadowany

    return () => clearInterval(interval);
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      <p>Please wait while we verify your subscription and prepare your download.</p>
    </div>
  );
};

export default Processing;
