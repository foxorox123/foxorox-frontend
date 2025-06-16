import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
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
    if (plan && email) {
      localStorage.setItem("postPaymentPlan", plan);
      localStorage.setItem("postPaymentEmail", email);
    }

    let resolved = false;
    let elapsed = 0;
    const maxWait = 30;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === email && !resolved) {
        resolved = true;
        localStorage.removeItem("postPaymentPlan");
        localStorage.removeItem("postPaymentEmail");

        if (plan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else {
          navigate("/downloads/premium");
        }
      }
    });

    const fallbackInterval = setInterval(() => {
      elapsed++;
      setSecondsLeft(maxWait - elapsed);

      const currentUser = getAuth().currentUser;
      if (
        currentUser &&
        currentUser.email === email &&
        !resolved
      ) {
        resolved = true;
        clearInterval(fallbackInterval);
        unsubscribe();
        localStorage.removeItem("postPaymentPlan");
        localStorage.removeItem("postPaymentEmail");

        if (plan.startsWith("basic")) {
          navigate("/downloads/basic");
        } else {
          navigate("/downloads/premium");
        }
      }

      if (elapsed >= maxWait && !resolved) {
        clearInterval(fallbackInterval);
        unsubscribe();
        setMessage("⚠️ Could not confirm your login. Please log in again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    }, 1000);

    return () => {
      clearInterval(fallbackInterval);
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
