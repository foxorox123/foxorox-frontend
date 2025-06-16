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

  const [status, setStatus] = useState("loading"); // loading | failed

  useEffect(() => {
    // Zapisz dane do localStorage/sessionStorage
    if (plan && email) {
      localStorage.setItem("postPaymentPlan", plan);
      localStorage.setItem("postPaymentEmail", email);
      sessionStorage.setItem("postPaymentPlan", plan);
      sessionStorage.setItem("postPaymentEmail", email);
    }

    // Poczekaj aż użytkownik się zaloguje
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr && usr.email === email && usr.emailVerified) {
        // 🔁 Przekieruj do processing z tymi parametrami
        navigate(`/processing?plan=${plan}&email=${email}`);
      } else {
        setStatus("failed");
      }
    });

    return () => unsubscribe();
  }, [plan, email, navigate]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      {status === "loading" ? (
        <>
          <h1>🔁 Wracamy ze Stripe...</h1>
          <p>Sprawdzanie sesji logowania...</p>
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
