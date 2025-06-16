import React, { useEffect } from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const postPaymentPlan =
          localStorage.getItem("postPaymentPlan") ||
          sessionStorage.getItem("postPaymentPlan");
        const postPaymentEmail =
          localStorage.getItem("postPaymentEmail") ||
          sessionStorage.getItem("postPaymentEmail");

        if (
          user &&
          user.emailVerified &&
          postPaymentPlan &&
          postPaymentEmail === user.email
        ) {
          navigate(
            `/processing?plan=${encodeURIComponent(
              postPaymentPlan
            )}&email=${encodeURIComponent(postPaymentEmail)}`
          );
        } else {
          if (onSuccess) {
            onSuccess(); // przekierowuje na /
          } else {
            navigate("/");
          }
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Failed to log in.");
      });
  };

  useEffect(() => {
    // automatyczne przekierowanie jeśli user już zalogowany
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const postPaymentPlan =
          localStorage.getItem("postPaymentPlan") ||
          sessionStorage.getItem("postPaymentPlan");
        const postPaymentEmail =
          localStorage.getItem("postPaymentEmail") ||
          sessionStorage.getItem("postPaymentEmail");

        if (
          user.emailVerified &&
          postPaymentPlan &&
          postPaymentEmail === user.email
        ) {
          navigate(
            `/processing?plan=${encodeURIComponent(
              postPaymentPlan
            )}&email=${encodeURIComponent(postPaymentEmail)}`
          );
        } else {
          navigate("/");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h2>Log in to continue</h2>
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
