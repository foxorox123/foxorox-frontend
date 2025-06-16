import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [secondsLeft, setSecondsLeft] = useState(30);
  const [message, setMessage] = useState("⏳ Processing your transaction. Pleas wait 30-40 seconds");

  useEffect(() => {
    let retries = 0;
    const maxRetries = 30;

    const interval = setInterval(() => {
      const user = auth.currentUser;

      if (user && user.email === email) {
        clearInterval(interval);
        if (plan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else {
          navigate("/downloads/premium");
        }
      } else {
        retries++;
        setSecondsLeft(maxRetries - retries);
        if (retries >= maxRetries) {
          clearInterval(interval);
          setMessage("⚠️ Could not confirm your login. Please log in again.");
          setTimeout(() => navigate("/login"), 3000);
        }
      }
    }, 1000); // co sekundę

    return () => clearInterval(interval);
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>{message}</h1>
      {message.includes("Processing") && (
        <p>Please wait ({secondsLeft}s)...</p>
      )}
      <p>If nothing happens, you'll be redirected to login.</p>
    </div>
  );
};

export default Processing;
