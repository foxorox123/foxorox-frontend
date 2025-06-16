import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";

const Returning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get("plan");
  const email = params.get("email");

  const [message, setMessage] = useState("🔄 Wracamy z Stripe...");

  useEffect(() => {
    if (plan && email) {
      localStorage.setItem("postPaymentPlan", plan);
      localStorage.setItem("postPaymentEmail", email);
      sessionStorage.setItem("postPaymentPlan", plan);
      sessionStorage.setItem("postPaymentEmail", email);
    }

    let attempts = 0;
    const maxAttempts = 20;

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr && usr.email === email && usr.emailVerified) {
        navigate(`/processing?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`);
      }
    });

    const interval = setInterval(() => {
      const user = auth.currentUser;
      attempts++;

      if (user && user.email === email && user.emailVerified) {
        clearInterval(interval);
        unsubscribe();
        navigate(`/processing?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        unsubscribe();
        setMessage("❌ Nie można potwierdzić logowania");
        setTimeout(() => navigate("/login"), 5000);
      }
    }, 1500);

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "80px" }}>
      <h2>{message}</h2>
      {message.startsWith("🔄") && <p>Sprawdzanie sesji logowania...</p>}
    </div>
  );
};

export default Returning;
