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
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (plan && email) {
      localStorage.setItem("postPaymentPlan", plan);
      localStorage.setItem("postPaymentEmail", email);
      sessionStorage.setItem("postPaymentPlan", plan);
      sessionStorage.setItem("postPaymentEmail", email);
    }

    let retries = 0;
    const maxRetries = 30;

    const interval = setInterval(() => {
      const user = auth.currentUser;
      if (user && user.email && user.email.toLowerCase() === email.toLowerCase() && user.emailVerified) {
        clearInterval(interval);
        setStatus("redirecting");
        navigate(`/processing?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`);
      } else {
        retries++;
        console.log("⌛ Oczekiwanie na użytkownika...", user?.email);
        if (retries >= maxRetries) {
          clearInterval(interval);
          setStatus("timeout");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "80px" }}>
      {status === "checking" && (
        <>
          <h2>🔄 Wracamy z Stripe...</h2>
          <p>Sprawdzanie sesji logowania...</p>
        </>
      )}
      {status === "redirecting" && (
        <h2>✅ Przekierowuję do pobierania...</h2>
      )}
      {status === "timeout" && (
        <>
          <h2>❌ Nie można potwierdzić logowania</h2>
          <p>Spróbuj zalogować się ponownie.</p>
        </>
      )}
    </div>
  );
};

export default Returning;
