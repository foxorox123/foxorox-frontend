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

    // ✅ Obsługa przypadku, gdy user już zalogowany
    checkAndRedirect(auth.currentUser);

    // ✅ Nasłuch Firebase
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
          <p>Sprawdzanie sesji logowania.</p>
        </>
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
