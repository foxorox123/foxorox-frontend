import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

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

    let attempts = 0;
    const maxAttempts = 15;

    const interval = setInterval(() => {
      const user = auth.currentUser;
      console.log("🔁 Checking Firebase user...", user?.email);

      if (user && user.email === email && user.emailVerified) {
        clearInterval(interval);
        navigate(`/processing?plan=${plan}&email=${email}`);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setStatus("failed");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [plan, email, navigate]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      {status === "checking" ? (
        <>
          <h1>🔁 Wracamy ze Stripe...</h1>
          <p>Sprawdzanie logowania... Proszę czekać.</p>
        </>
      ) : (
        <>
          <h1>❌ Nie można potwierdzić logowania</h1>
          <p>Spróbuj zalogować się ponownie.</p>
        </>
      )}
    </div>
  );
};

export default Returning;
