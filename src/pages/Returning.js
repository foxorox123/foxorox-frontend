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
    const maxRetries = 60;
    const retryDelay = 1000;

    const checkAndRedirect = (usr) => {
      if (usr && usr.email?.toLowerCase() === email.toLowerCase() && usr.emailVerified) {
        setStatus("success");
        navigate(`/processing?plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`);
      }
    };

    checkAndRedirect(auth.currentUser);

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      checkAndRedirect(usr);
    });

    const timeout = setInterval(() => {
      retries++;
      if (retries >= maxRetries) {
        clearInterval(timeout);
        unsubscribe();
        setStatus("timeout");
      }
    }, retryDelay);

    return () => {
      unsubscribe();
      clearInterval(timeout);
    };
  }, [navigate, plan, email]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      {status === "checking" && (
        <>
          <h2>🔄 Wracamy z Stripe.</h2>
          <p>Sprawdzanie sesji logowania...</p>
        </>
      )}
      {status === "timeout" && (
        <>
          <h2>❌ Nie można potwierdzić logowania</h2>
          <p>Spróbuj zalogować się ponownie tym samym adresem email: <strong>{email}</strong></p>
          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#f58220",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            🔐 Zaloguj się ponownie
          </button>
        </>
      )}
    </div>
  );
};

export default Returning;
